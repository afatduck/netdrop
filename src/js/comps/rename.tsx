import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { bindActionCreators } from 'redux'

import { getBaseFtpRequest } from '../utils'

import * as ActionCreators from '../actions'

export const Rename = (props: { name: string, setLoading: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const { name, setLoading } = props

  const { path, cdir } = useSelector((state: RootState) => state)
  const dispatch = useDispatch()
  const { updateError, updateCdir, updateLevel, updateItemMenu } = bindActionCreators(ActionCreators, dispatch)

  const [editing, setEditing]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [input, setInput]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(name)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditing(true)
    setInput(name)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInput(e.target.value) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (name == input) {
      setEditing(false)
      return
    }

    setLoading(true)

    $.ajax({
      url: globalThis.apiLocation + "rename",
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify({
        Path: path.substr(1) + '/' + name,
        Name: input,
        ...getBaseFtpRequest()
      })
    })
      .done((data: BaseResponse) => {
        setLoading(false)
        setEditing(false)
        updateItemMenu(null)
        if (!data.result) {
          updateError(data.errors[0])
          return
        }
        updateError('')
        let cdirCopy: directory[] = [...cdir]
        for (let dir of cdirCopy) {
          if (dir.name == name) { dir.name = input }
        }
        updateCdir(cdirCopy)
      })
      .fail(() => { updateLevel("CONNECTING") })

  }

  return (
    <div>
      <button type="button" name="rename" className="button-clear" onClick={handleClick}>
        Rename
        </button>
      {
        !editing ? null :
          <div className="overlay">
            <form onSubmit={handleSubmit}>
              <i className="fas fa-times" onClick={() => { setEditing(false) }} />
              <div>
                <label htmlFor="rename-input">Rename to:</label>
                <input id="rename-inpupt" placeholder="New name" name="rename" autoComplete="ftp-rename" value={input} onChange={handleChange} />
              </div>
              <button type="submit" className="button-highlight">Rename</button>
            </form>
          </div>
      }
    </div>
  )

}
