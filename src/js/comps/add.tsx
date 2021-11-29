import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

import { getBaseFtpRequest } from '../utils'
import { listdir } from './listdir'
import { uploadFiles } from './uploadfiles'

export const AddTab = () => {

  const path = useSelector((state: RootState) => state.path)
  const request = useSelector((state: RootState) => state.globals.request)
  const dispatch = useDispatch()
  const { updateError, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const [input, setInput]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('')
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [open, setOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!input) { return }
    setLoading(true)
    $.ajax({
      url: globalThis.apiLocation + e.currentTarget.name,
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
        listdir()
        updateError("")
        setOpen(false)
      })
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(e.target.files)
  }

  const handleLabel = (e: React.MouseEvent<HTMLLabelElement>) => {
    if (e.target != e.currentTarget) {
      e.currentTarget.click()
    }
  }

  useEffect(() => {
    $("#uploaddir").attr("directory", "")
    $("#uploaddir").attr("webkitdirectory", "")
    $("#uploaddir").attr("mozdirectory", "")
  })

  return (
    <div id="add-tab">
      <div className="loader" style={{ display: (request ? "block" : "none") }} />
      <button className="button-small ml-auto mr-2" onClick={() => { listdir() }} >Refresh</button>
      <button className="button-small" onClick={() => { setOpen(true) }}>Add +</button>
      {
        open ?
          <div id="tab-overlay">
            <div id="add-inner">
              <i className="fas fa-times" onClick={() => { setOpen(false) }} />

              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="new-item-input">Create new: </label>
                  <input id="new-item-input" type="text" value={input} onChange={handleChange} />
                </div>
                {
                  loading ? <div className="loader ml-auto mr-auto"></div> :
                    <div className="buttons">
                      <button type="button" name="createfile" className="button-highlight" disabled={input == ""} onClick={handleCreate}>Empty File</button>
                      <button type="button" name="createdir" className="button-highlight" disabled={input == ""} onClick={handleCreate}>Directory</button>
                    </div>
                }
              </form>

              <h5 className="text-center mt-5">OR</h5>
              <p style={{ fontSize: "1.6rem", fontWeight: 700 }}>Upload: </p>

              <input type="file" id="uploadfiles" name="files" onChange={handleUpload} multiple={true} />
              <input type="file" id="uploaddir" name="dir" onChange={handleUpload} />

              <div className="buttons">

                <label htmlFor="uploadfiles" onClick={handleLabel}>
                  <button type="button" name="uploadfiles" className="button-outline">Files</button>
                </label>

                <label htmlFor="uploaddir" onClick={handleLabel}>
                  <button type="button" name="uploaddir" className="button-outline">Directory</button>
                </label>

              </div>

              <blockquote style={{ margin: "3rem 0 0 0" }}><em>Note: Uploading directories is not supported by all browsers.</em></blockquote>

            </div>
          </div>
          : null
      }
    </div>
  )

}
