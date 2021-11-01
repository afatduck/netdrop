import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

export const Rename = (props: { name: string }) => {

  const { path, cdir } = useSelector((state: RootState) => state)
  const dispatch = useDispatch()
  const { updateError, updateCdir } = bindActionCreators(ActionCreators, dispatch)

  const [editing, setEditing]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [input, setInput]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(props.name)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditing(!editing)
    setInput(props.name)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInput(e.target.value) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    $.ajax({
      url: globalThis.apiLocation + "rename",
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify({
        path: '/' + path + '/' + props.name,
        name: input,
        host: localStorage.getItem('host'),
        user: localStorage.getItem('user'),
        pword: globalThis.ftpPassword
      }),
      success: (data: string) => {
        if (data) {
          updateError(data)
          return
        }
        updateError('')
        let cdirCopy: directory[] = [...cdir]
        for (let dir of cdirCopy) {
          if (dir.name == props.name) { dir.name = input }
        }
        updateCdir(cdirCopy)
      }
    })
      .done(() => {
        setLoading(false)
        setEditing(false)
      })

  }

  return (
    <span className='d-flex justify-content-between align-items-center'>

      {
        editing ?
          <form className="form-inline" onSubmit={handleSubmit} onClick={(e: React.MouseEvent) => { e.stopPropagation() }}>
            <div className="form-group">
              <input className="form-control" value={input} onChange={handleChange} />
            </div>
          </form>
          :
          <span>{props.name}</span>
      }

      {
        loading ?
          <div className="spinner-border spinner-border-sm ml-4" role="status">
            <span className="sr-only"></span>
          </div>
          :
          <i className="fas fa-pen ml-2" onClick={handleClick} />
      }

    </span>
  )

}
