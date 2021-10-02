import React, { useState } from 'react'

export const HostForm = (props: { update: React.Dispatch<React.SetStateAction<string>> }) => {

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
        props.update(data)
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
