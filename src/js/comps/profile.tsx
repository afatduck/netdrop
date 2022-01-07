import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

const getTitle = (p: ProfileRequests): string => {
  switch (p) {
    case "DEL": return "Delete account"
    case "CUN": return "Change username"
    case "CPW": return "Change password"
  }
}

export const ProfileOverlay = () => {

  const dispatch = useDispatch()
  const { updateUser, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const { user } = useSelector((state: RootState) => state.globals)

  const [req, setReq]: [ProfileRequests, React.Dispatch<React.SetStateAction<ProfileRequests>>] = useState(null)
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [profile, setProfile]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [dropdown, setDropdown]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [error, setError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('')
  const [selected, setSelected]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('Saved Connections')
  const [input, setInput]: [ProfileInput, React.Dispatch<React.SetStateAction<ProfileInput>>] = useState({
    new: '',
    cpwd: ''
  })

  useEffect(() => {
    setInput({
      new: '',
      cpwd: ''
    })
    setError("")
    setLoading(false)
  }, [req])

  useEffect(() => {
    setSelected("Saved Connections")
    setDropdown(false)
  }, [profile])

  useEffect(() => {
    $(document).click((e: JQuery.ClickEvent) => {
      let container = $(".dropdown");
      if (!container.is(e.target) && !container.has(e.target).length) {
        setDropdown(false)
      }
    })
  }, [])

  const handleDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    const id: number = parseInt(e.currentTarget.getAttribute("data-id"))
    const cred: Credentials = user.credentials[id]
    setSelected(cred.name)
  }

  let savedCredentials: JSX.Element[] = []
  if (user) {
    for (let i in user.credentials) {
      let cred: Credentials = user.credentials[i]
      savedCredentials.push(
        <div data-id={i} onClick={handleDropdown}>
          <p style={{ lineHeight: 0 }}>{cred.name}</p>
          <p style={{ fontSize: "50%", lineHeight: 0 }}>{cred.host}</p>
        </div>
      )
    }
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setProfile(false)
    setReq(null)
  }

  const handleReqClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (loading) { return }
    setReq(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInput((p) => {
      p[name] = value
      return { ...p }
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    $.ajax({
      url: globalThis.apiLocation + req,
      type: "POST",
      timeout: 1e4,
      contentType: "application/json; charset=utf-8",
      processData: false,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      data: JSON.stringify({
        Old: input.cpwd,
        New: input.new
      })
    })
      .done((data: BaseResponse) => {
        if (!data.result) {
          setError(data.errors.join("\n"))
          return
        }
        if (req == "CUN") {
          let newuser = user
          newuser.username = input.new
          updateUser(newuser)
        }
        if (req == "DEL") {
          updateUser(null)
        }
        setReq(null)
      })
      .fail(() => { updateLevel("CONNECTING") })
      .always(() => { setLoading(false) })
  }

  const handleRemove = () => {
    setLoading(true)
    $.ajax({
      url: globalThis.apiLocation + "removecred",
      type: "POST",
      timeout: 1e4,
      contentType: "application/json; charset=utf-8",
      processData: false,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      data: JSON.stringify(selected)
    })
      .done(() => {
        let newCreds = user.credentials
        newCreds = newCreds.filter(a => a.name != selected)
        let newUser = user
        user.credentials = newCreds
        updateUser(newUser)
        setSelected("Saved Connections")
      })
      .fail(() => { updateLevel("CONNECTING") })
      .always(() => { setLoading(false) })
  }

  return (
    <u id="username" onClick={() => { setProfile(true) }}><span>{user.username}</span>
      {profile ?
        <div className="overlay">
          <div id="profile">
            <i className="fas fa-times" onClick={handleClose} />
            <h2>{user.username} <i className="fas fa-pen" onClick={() => { setReq("CUN") }} /></h2>
            <div className="buttons">
              <button type="button" className="button-outline" name="change_password" onClick={() => { setReq("CPW") }}>Change password</button>
              <button type="button" className="button-outline" name="delete_profile" onClick={() => { setReq("DEL") }}>Delete profile</button>
            </div>
            <blockquote><em>Note: Changing username or password will sign you out from all other devices.</em></blockquote>
            <div className="buttons">
              <button type="button" className="dropdown" onClick={() => { setDropdown(!dropdown) }}>
                {selected}
                <i className={`fas fa-angle-${dropdown ? "down" : "up"} mt-1`} />
                <section style={dropdown ? null : { display: "none" }}>{savedCredentials}</section>
              </button>
              {
                loading ? <div className="loader center" /> :
                  <button type="button" className="button-clear" name="remove_cred" onClick={handleRemove} disabled={selected == "Saved Connections"}>Remove Credential</button>
              }
            </div>
            {
              req ?
                <div className="overlay">
                  <form onSubmit={handleSubmit}>
                    <i className="fas fa-times" onClick={handleReqClose} />
                    <h2>{getTitle(req)}</h2>
                    <div>
                      <label htmlFor="profile_cpwd_input">Current Password:</label>
                      <input type="password" name="cpwd" placeholder="Current Password" id="profile_cpwd_input" value={input.cpwd} onChange={handleChange} />
                    </div>
                    {req == "DEL" ? null :
                      <div>
                        <label htmlFor="profile_new_input">{req == 'CUN' ? "New Username" : "New Password"}:</label>
                        <input type={req == "CUN" ? "text" : "password"} name="new" placeholder={req == 'CUN' ? "New Username" : "New Password"} id="profile_new_input" value={input.new} onChange={handleChange} />
                      </div>
                    }
                    <p className="text-error">{error}</p>
                    {
                      loading ? <div className="loader center" /> :
                        <button type="submit" className="button-highlight">{req == "DEL" ? "Delete" : "Change"}</button>
                    }
                  </form>
                </div>
                : null
            }
          </div>
        </div>
        : null}
    </u>
  )

}
