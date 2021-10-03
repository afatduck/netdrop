import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

export const HostForm = () => {

  const dispatch = useDispatch()
  const { updateError, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const [input, setInput]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(globalThis.host)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    $.post(
      location.href,
      {
        rest: true,
        host: input
      },
      data => {
        updateError(data)
        updateLevel(data ? '' : 'LOGIN')
      }
    )
  }

  return (
    <form className="col-3 p-0" method="post" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="host_input">Host:</label>
        <input type="text" autoComplete="off" className="form-control" id="host_input" name="host" value={input} onChange={handleChange} />
      </div>
      <button type="submit" name="enter_host" className="btn btn-sm btn-primary">Connect</button>
    </form>
  )

}
