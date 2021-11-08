import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

export const LoginForm = () => {

  const userData = useSelector((state: RootState) => state.globals.user)

  const dispatch = useDispatch()
  const { updateLevel, updateCdir, updatePath } = bindActionCreators(ActionCreators, dispatch)

  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [form, setForm]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [save, setSave]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
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
    for (let cred of userData.credentials) {
      if (cred.host == input.host && cred.password == input.password && cred.username == input.user && input.port == cred.port.toString()) {
        return false
      }
    }
    return true
  }

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
        <div className="dropdown-item pt-3" data-id={i} onClick={handleDropdown}>
          <p style={{ lineHeight: 0 }}>{cred.name}</p>
          <p style={{ fontSize: "50%", lineHeight: 0 }}>{cred.host}</p>
        </div>
      )
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    let { value, name, checked } = e.target

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
      timeout: 2e4,
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify({
        Host: input.host,
        Username: input.user,
        Password: input.password,
        Secure: input.secure,
        Port: parseInt(input.port),
        Path: ""
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
        localStorage.setItem('user', input.user)
        localStorage.setItem('host', input.host)
        localStorage.setItem('secure', input.secure ? "true" : "false")
        localStorage.setItem('port', input.port)
        globalThis.ftpPassword = input.password
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
    <div>
      <button className="btn btn-primary btn-sm mr-5 d-block" type="button" onClick={() => { setForm(true); setSave(false) }}>New Connection</button>
      {(() => {
        if (form) return (
          <div className="overlay">
            {!save ?




              <form className="bg-white d-flex flex-column" onSubmit={handleSubmit}>
                <i className="fas fa-times" onClick={() => { setForm(false) }} />

                <div className="form-group">
                  <label htmlFor="ftp_host_input">Host:</label>
                  <input type="text" className="form-control" name="host" placeholder="Host" id="ftp_host_input" autoComplete="ftphost" value={input.host} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="ftp_username_input">Username:</label>
                  <input type="text" className="form-control" name="user" placeholder="Username" id="ftp_user_input" autoComplete="ftpuser" value={input.user} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="ftp_password_input">Password:</label>
                  <input type="password" className="form-control" name="password" placeholder="Password" id="ftp_password_input" autoComplete="ftppassword" value={input.password} onChange={handleChange} />
                </div>
                <div className="form-group w-25">
                  <label htmlFor="ftp_port_input">Port:</label>
                  <input type="number" className="form-control" name="port" placeholder="Port" id="ftp_port_input" autoComplete="ftpport" value={input.port} onChange={handleChange} />
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" name="secure" id="ftp_secure_check" checked={input.secure} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="ftp_secure_check">Secure Connection</label>
                </div>

                {
                  !userData ? null :
                    <div className="btn-group mt-2 mb-2 ml-auto">
                      <button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {selected}</button>
                      <div className="dropdown-menu">
                        {savedCredentials}
                      </div>
                    </div>
                }

                <p className="text-danger">{error}</p>
                {
                  loading ?
                    <div className="spinner-border spinner-border-sm align-self-center" role="status">
                      <span className="sr-only"></span>
                    </div>
                    :
                    <button type="submit" id="login_button" className="btn btn-primary">Connect</button>
                }
              </form> :




              <form className="bg-white d-flex flex-column" onSubmit={handleSaveSubmit}>
                <i className="fas fa-times" onClick={() => { setForm(false) }} />
                <h2>Save connection?</h2>
                <div className="form-group">
                  <label htmlFor="ftp_save_input">Connection Name:</label>
                  <input type="text" className="form-control" name="name" placeholder="Connection Name" id="ftp_name_input" autoComplete="ftpname" value={saveName} onChange={handleSaveChange} />
                </div>
                <p className="text-danger">{error}</p>
                {
                  loading ?
                    <div className="spinner-border spinner-border-sm align-self-center" role="status">
                      <span className="sr-only"></span>
                    </div>
                    :
                    <button type="submit" id="save_button" className="btn btn-primary">Save</button>
                }
              </form>



            }
          </div>
        )
      })()}
    </div>
  )

}
