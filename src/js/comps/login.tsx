import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

export const LoginForm = () => {

  const dispatch = useDispatch()
  const { updateError, updateLevel, updateCdir } = bindActionCreators(ActionCreators, dispatch)

  const [creds, setCreds]: [creds, React.Dispatch<React.SetStateAction<creds>>] = useState({
    user: localStorage.getItem('user'),
    pword: localStorage.getItem('pword')
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    $.ajax(
      globalThis.apiLocation + 'listdir',
      {
        type: "POST",
        data: JSON.stringify({
          host: localStorage.getItem('host'),
          user: creds.user,
          pword: creds.pword
        }),
        processData: false,
        contentType: 'application/json; charset=utf-8',
        success: data => {
          data = JSON.parse(data) as string | directory[]
          if (typeof data === 'string') {
            updateError(data)
            return
          }
          updateCdir(data)
          updateLevel('BROWSE')
          updateError('')
          localStorage.setItem('user', creds.user)
          localStorage.setItem('pword', creds.pword)
        }
      }
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreds((prev: creds) => {
      prev[e.target.name] = e.target.value
      return { ...prev }
    })
  }

  return (
    <form className="col-3 p-0 mt-3" method="post" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="uname_input">User:</label>
        <input type="text" autoComplete="off" className="form-control" id="uname_input" name="user" value={creds.user} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="pword_input">Password:</label>
        <input type="text" autoComplete="off" className="form-control" id="pword_input" name="pword" value={creds.pword} onChange={handleChange} />
      </div>
      <button type="submit" name="enter_creds" className="btn btn-sm btn-primary">Login</button>
    </form>
  )

}
