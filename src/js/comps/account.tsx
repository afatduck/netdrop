import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import { AccountForm } from './accountform'
import * as ActionCreators from '../actions'

export const Account = () => {

  const user = useSelector((state: RootState) => state.globals.user)

  const dispatch = useDispatch()
  const { updateUser, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [form, setForm]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)

  const handleButton = () => {
    if (user) {
      setLoading(true)
      $.ajax({
        url: globalThis.apiLocation + "logout",
        type: "GET",
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        timeout: 1e4
      })
        .done(() => {
          localStorage.removeItem("logged-in")
          updateUser(null)
        })
        .fail(() => {
          updateLevel("CONNECTING")
        })
        .always(() => {
          setLoading(false)
        })
      return
    }
    setForm(true)
  }

  useEffect(() => {
    if (localStorage.getItem('logged-in')) {
      setLoading(true)
      $.ajax({
        url: globalThis.apiLocation + "logininfo",
        type: 'GET',
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        timeout: 1e4
      })
        .done((data: UserData) => {
          updateUser(data)
        })
        .always(() => {
          setLoading(false)
        })
    }
  }, [])

  return (
    <div className="column" id="nav-account">
      {form ? <AccountForm close={setForm} /> : null}
      <span className="mr-3">{user ? `Logged in as: ${user.username}` : `Not logged in.`}</span>
      {
        loading ?
          <div className="loader" />
          :
          <button type='button' className="button-small" onClick={handleButton}>{user ? "Sign out" : "Sign in"}</button>
      }
    </div>
  )
}
