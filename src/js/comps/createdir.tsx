import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

import { getBaseFtpRequest } from '../utils'

export const CreateDir = () => {

  const path = useSelector((state: RootState) => state.path)
  const dispatch = useDispatch()
  const { updateCdir, updateError, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const [input, setInput]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('')
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    $.ajax({
      url: globalThis.apiLocation + 'createdir',
      processData: false,
      contentType: 'application/json; charset=utf-8',
      type: 'POST',
      data: JSON.stringify({
        ...getBaseFtpRequest(),
        Path: path.substr(1) + '/' + input
      })
    })
      .fail(() => {
        updateLevel("CONNECTING")
      })
      .done((data: BaseResponse) => {
        setLoading(false)
        if (!data.result) {
          updateError(data.errors[0])
          return
        }
        updateError("")
        const t = new Date()
        updateCdir({
          name: input,
          size: null,
          modify: `${t.getMonth() + 1}/${t.getDate()}/${t.getFullYear()} ${t.getHours()}:${t.getMinutes()}`,
          type: 'dir'
        })
      })
  }

  return (
    <form className="form-inline ml-auto" onSubmit={handleSubmit}>
      <div className="form-group">
        <input className="form-control input-sm text-center" type="text" placeholder="dir name" value={input} onChange={handleChange} />
      </div>
      {
        loading ?
          <div className="spinner-border spinner-border-sm ml-2" role="status">
            <span className="sr-only"></span>
          </div>
          :
          <button type="submit" className="btn btn-outline-primary ml-2" disabled={!input}>Create Dir</button>
      }
    </form>
  )
}
