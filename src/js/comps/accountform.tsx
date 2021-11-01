import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

export const AccountForm = (props: { close: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const dispatch = useDispatch()
  const { updateUser, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const [action, setAction]: ['Sign In' | 'Sign Up', React.Dispatch<React.SetStateAction<'Sign In' | 'Sign Up'>>] = useState('Sign In')
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [error, setError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('')
  const [input, setInput]: [LoginInput, React.Dispatch<React.SetStateAction<LoginInput>>] = useState({
    user: '',
    password: '',
    repeat: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setError("")
    const { name, value } = e.target
    setInput((prev: LoginInput) => {
      prev[name] = value
      return { ...prev }
    })

  }

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault()
    if (loading) { return }

    if (input.password.length * input.user.length * (action == 'Sign In' ? 1 : input.repeat.length) == 0) {
      setError("Can't have empty fields.")
      return
    }

    if (input.password != input.repeat && action != "Sign In") {
      setError("Passwords do not match.")
      return
    }

    setError("")
    setLoading(true)

    $.ajax({
      url: globalThis.apiLocation + (action == 'Sign In' ? 'login' : 'register'),
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      processData: false,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      timeout: 1e4,
      data: JSON.stringify({
        Username: input.user,
        Password: input.password
      })
    })
      .done((response: LoginResponse) => {
        setLoading(false)
        if (response.result) {
          updateUser(response.userData)
          props.close(false)
          localStorage.setItem("logged-in", 'true')
          return
        }
        setError(response.errors[0])
      })
      .fail(() => {
        updateLevel("CONNECTING")
      })

  }

  return (
    <div className="overlay">
      <form className="bg-white" onSubmit={handleSubmit}>
        <i className="fas fa-times" onClick={() => { props.close(false) }} />
        <div className="form-group">
          <label htmlFor="account_username_input">Username:</label>
          <input type="text" className="form-control" name="user" placeholder="Username" id="account_user_input" value={input.user} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="account_password_input">Password:</label>
          <input type="password" className="form-control" name="password" placeholder="Password" id="account_password_input" value={input.password} onChange={handleChange} />
        </div>
        {action == "Sign In" ?
          null :
          <div className="form-group">
            <label htmlFor="account_repeat_input">Repeat Password:</label>
            <input type="password" className="form-control" name="repeat" placeholder="Repeat password" id="account_repeat_input" value={input.repeat} onChange={handleChange} />
          </div>
        }
        {
          action == "Sign In" ?
            <button type="button" className="btn btn-outline-info btn-sm ml-auto d-block mb-2" onClick={() => { setAction("Sign Up") }}>Don't have an account.</button>
            :
            <button type="button" className="btn btn-outline-info btn-sm ml-auto d-block mb-2" onClick={() => { setAction("Sign In") }}>Already have an account.</button>
        }
        <p className="text-danger">{error}</p>
        {
          loading ?
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="sr-only"></span>
            </div>
            :
            <button type="submit" id="account_button" className="btn btn-primary">{action}</button>
        }
      </form>
    </div>
  )


}
