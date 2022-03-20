import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

export const LoginForm = () => {

  const userData = useSelector((state: RootState) => state.globals.user)
  const consent = useSelector((state: RootState) => state.globals.consent)

  const dispatch = useDispatch()
  const { updateLevel, updateCdir, updatePath, updateItemMenu } = bindActionCreators(ActionCreators, dispatch)

  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [form, setForm]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [save, setSave]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [dropdown, setDropdown]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [error, setError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('')
  const [selected, setSelected]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('Saved Connections')
  const [saveName, setSaveName]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('')
  const [input, setInput]: [creds, React.Dispatch<React.SetStateAction<creds>>] = useState({
    host: localStorage.getItem('host') || "",
    user: localStorage.getItem('user') || "",
    password: '',
    secure: localStorage.getItem('secure') == "true",
    port: localStorage.getItem('port') || (localStorage.getItem('secure') == "true" ? "990" : "21")
  })

  const checkIfDifferent = () => {
    if (!userData) { return false }
    for (let cred of userData.credentials) {
      if (cred.host == globalThis.ftpHost &&
         cred.password == globalThis.ftpPassword && 
         cred.username == globalThis.ftpUser && 
         cred.port == globalThis.ftpPort) return false
    }
    return true
  }

  useEffect(() => {
    $(document).click((e: JQuery.ClickEvent) => {

      let container = $(".dropdown");
      if (!container.is(e.target) && !container.has(e.target).length) {
        setDropdown(false)
      }

      container = $("#item-menu");
      if (!container.is(e.target) && !container.has(e.target).length) {
        updateItemMenu(null)
      }


    })
  }, [])

  useEffect(() => { setError('') }, [form])

  const handleDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    const id: number = parseInt(e.currentTarget.getAttribute("data-id"))
    const cred: Credentials = userData.credentials[id]
    setInput({
      host: cred.host,
      user: cred.username,
      password: cred.password,
      secure: cred.secure,
      port: cred.port.toString()
    })
    setSelected(cred.name)
  }

  let savedCredentials: JSX.Element[] = []
  if (userData) {
    for (let i in userData.credentials) {
      let cred: Credentials = userData.credentials[i]
      savedCredentials.push(
        <div data-id={i} onClick={handleDropdown}>
          <p>{cred.name}</p>
          <p>{cred.host}</p>
        </div>
      )
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (loading) return

    let { value, name, checked } = e.target
    name = name.substr(3)

    setInput((prev: creds) => {
      if (name == "secure" && (input.port == "21" || input.port == "990")) { prev.port = checked ? "990" : "21" }
      prev[name] = (name == 'secure' ? checked : value)
      return { ...prev }
    })

  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (input.host.length == 0) {
      setError("Host field is required.")
      return
    }

    setLoading(true)
    $.ajax({
      url: globalThis.apiLocation + "listdir",
      type: "post",
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify({
        Host: input.host,
        Username: input.user,
        Password: input.password,
        Secure: input.secure,
        Port: parseInt(input.port),
        Path: "/",
        New: true,
        Save: consent.connectionCookie
      })
    })
      .fail(() => {
        updateLevel("CONNECTING")
      })
      .done((data: ListDirRespone) => {
        setLoading(false)
        if (!data.result) {
          setError(data.errors[0])
          return
        }
        setError('')
        updateCdir(data.dirList)
        updatePath(-1)

        if (consent.creds) {
          localStorage.setItem('user', input.user)
          localStorage.setItem('host', input.host)
          localStorage.setItem('secure', input.secure ? "true" : "false")
          localStorage.setItem('port', input.port)
        }

        globalThis.ftpHost = input.host
        globalThis.ftpUser = input.user 
        globalThis.ftpPassword = input.password
        globalThis.ftpSecure = input.secure
        globalThis.ftpPort = parseInt(input.port)

       if (consent.connectionSession) sessionStorage.setItem("connection", data.connection)

        if (checkIfDifferent()) {
          setSave(true)
          return
        }
        setForm(false)
      })

  }

  const handleSaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveName(e.target.value)
  }

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!saveName) {
      setError("A name is required.")
      return
    }
    if (saveName == "Saved Connections") {
      setError("Not this one.")
      return
    }
    for (let cred of userData.credentials) {
      if (saveName == cred.name) {
        setError("Name already used.")
        return
      }
    }
    setLoading(true)
    $.ajax({
      url: globalThis.apiLocation + 'newcred',
      type: 'POST',
      timeout: 1e4,
      contentType: "application/json; charset=utf-8",
      processData: false,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      data: JSON.stringify({
        Name: saveName,
        Host: input.host,
        Username: input.user,
        Password: input.password,
        Secure: input.secure,
        Port: parseInt(input.port)
      })
    })
      .done(() => {
        setForm(false)
        setSave(false)
        let creds: Credentials[] = userData.credentials
        creds.push({
          name: saveName,
          host: input.host,
          username: input.user,
          password: input.password,
          secure: input.secure,
          port: parseInt(input.port)
        })
      })
      .fail(() => {
        updateLevel("CONNECTING")
      })
      .always(() => {
        setLoading(false)
      })

  }

  return (
    <div id="nav-login">
      <button className="button-small button-highlight ml-auto" type="button" onClick={() => { setForm(true); setSave(false) }}>New Connection</button>
      {(() => {
        if (form) return (
          <div className="overlay">
            {!save ?

              <form className="bg-white d-flex flex-column" autoComplete="off" onSubmit={handleSubmit}>
                <i className="fas fa-times" onClick={() => { setForm(false) }} />

                <div>
                  <label htmlFor="ftp_host_input">Host:</label>
                  <input type="text"
                    name="ftphost"
                    placeholder="Host"
                    id="ftp_host_input"
                    value={input.host}
                    onChange={handleChange} />
                </div>

                <div>
                  <label htmlFor="ftp_user_input">User:</label>
                  <input type="text"
                    name="ftpuser"
                    placeholder="User"
                    id="ftp_user_input"
                    value={input.user}
                    onChange={handleChange}
                    readOnly
                    onBlur={e => e.currentTarget.setAttribute("readOnly", "")}
                    onFocus={e => e.currentTarget.removeAttribute("readOnly")} />
                </div>

                <div>
                  <label htmlFor="ftp_password_input">Password:</label>
                  <input type="password"
                    name="ftppassword"
                    placeholder="Password"
                    id="ftp_password_input"
                    autoComplete="off"
                    value={input.password}
                    onChange={handleChange}
                    readOnly
                    onBlur={e => e.currentTarget.setAttribute("readOnly", "")}
                    onFocus={e => e.currentTarget.removeAttribute("readOnly")} />
                </div>

                <div style={{ width: "25%" }}>
                  <label htmlFor="ftp_port_input">Port:</label>
                  <input type="number"
                    name="ftpport"
                    placeholder="Port"
                    id="ftp_port_input"
                    value={input.port}
                    onChange={handleChange} />
                </div>

                <label htmlFor="ftp_secure_check" style={{ display: 'flex', width: "fit-content" }}>Implicit FTPS
                  <span className='checkbox-container ml-5'>
                    <input type="checkbox" className="m-2" name="ftpsecure" id="ftp_secure_check" checked={input.secure} onChange={handleChange} />
                    <span className='checkmark' />
                  </span>
                </label>

                {
                  !userData ? null :
                    <button type="button" className="dropdown" onClick={() => { setDropdown(!dropdown) }}>
                      {selected}
                      <i className={`fas fa-angle-${dropdown ? "down" : "up"} mt-1`} />
                      <section style={dropdown ? null : { display: "none" }}>{savedCredentials}</section>
                    </button>
                }

                <p className="text-error mt-3">{error}</p>
                {
                  loading ?
                    <div className="loader ml-auto mr-auto" />
                    :
                    <button type="submit" id="login_button" className="btn btn-primary">Connect</button>
                }
              </form> :

              <form onSubmit={handleSaveSubmit}>
                <i className="fas fa-times" onClick={() => { setForm(false) }} />
                <h2>Save connection?</h2>
                <div>
                  <label htmlFor="ftp_save_input">Connection Name:</label>
                  <input type="text" name="name" placeholder="Connection Name" id="ftp_name_input" value={saveName} onChange={handleSaveChange} />
                </div>
                <p className="text-error">{error}</p>
                {
                  loading ?
                    <div className="loader" />
                    :
                    <button type="submit" id="save_button" className="button-highlight">Save</button>
                }
              </form>



            }
          </div>
        )
      })()}
    </div>
  )

}
