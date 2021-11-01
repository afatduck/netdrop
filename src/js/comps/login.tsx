import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

export const LoginForm = () => {

  const userData = useSelector((state: RootState) => state.globals.user)

  const dispatch = useDispatch()
  const { updateLevel, updateCdir, updatePath } = bindActionCreators(ActionCreators, dispatch)

  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [form, setForm]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [error, setError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('')
  const [input, setInput]: [creds, React.Dispatch<React.SetStateAction<creds>>] = useState({
    host: localStorage.getItem('host') || "",
    user: localStorage.getItem('user') || "",
    password: '',
    secure: localStorage.getItem('secure') == "true"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    let { value, name, checked } = e.target

    setInput((prev: creds) => {
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
        setForm(false)
        updatePath(-1)
        localStorage.setItem('user', input.user)
        localStorage.setItem('host', input.host)
        localStorage.setItem('secure', input.secure ? "true" : "false")
        globalThis.ftpPassword = input.password
      })

  }

  return (
    <div>
      <button className="btn btn-primary btn-sm mr-5 d-block" type="button" onClick={() => { setForm(true) }}>New Connection</button>
      {(() => {
        if (form) return (
          <div className="overlay">
            <form className="bg-white" onSubmit={handleSubmit}>
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
              <div className="form-check">
                <input type="checkbox" className="form-check-input" name="secure" id="ftp_secure_check" checked={input.secure} onChange={handleChange} />
                <label className="form-check-label" htmlFor="ftp_secure_check">Secure Connection</label>
              </div>

              <p className="text-danger">{error}</p>
              {
                loading ?
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="sr-only"></span>
                  </div>
                  :
                  <button type="submit" id="account_button" className="btn btn-primary">Connect</button>
              }
            </form>
          </div>
        )
      })()}
    </div>
  )

}
