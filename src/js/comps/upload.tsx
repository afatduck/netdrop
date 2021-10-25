import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

export const UploadFile = () => {

  const path = useSelector((state: RootState) => state.path)

  const dispatch = useDispatch()
  const { updateError } = bindActionCreators(ActionCreators, dispatch)

  const [files, setFiles]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0)
  const [progress, setProgress]: [progress, React.Dispatch<React.SetStateAction<progress>>] = useState(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files.length)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let fd: FormData = new FormData()
    for (let i = 0; i < ($('#uploadfiles')[0] as HTMLInputElement).files.length; i++) {
      fd.append('files', ($('#uploadfiles')[0] as HTMLInputElement).files[i])
    }
    fd.append('dataJson', JSON.stringify({
      path: path.substr(1),
      host: localStorage.getItem('host'),
      user: localStorage.getItem('user'),
      pword: localStorage.getItem('pword')
    }))
    setProgress({
      title: 'Uploading files...',
      percentage: 0
    })
    $.ajax({
      xhr: () => {
        const xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            let percentComplete = Math.trunc((evt.loaded / evt.total) * 100);
            if (percentComplete == 100) {
              setProgress({
                title: 'Copying files...',
                percentage: 101
              })
            }
            setProgress((p: progress) => {
              p.percentage = percentComplete
              return { ...p }
            })
          }
        }, false);
        return xhr;
      },
      type: 'POST',
      url: globalThis.apiLocation + 'upload',
      contentType: false,
      processData: false,
      data: fd,
      success: (data: string) => {
        setProgress(null)
      }
    }).fail(() => {
      setProgress(null)
      updateError('Something went wrong.')
    })
  }

  return (
    <form className="form-inline" onSubmit={handleSubmit}>
      <label htmlFor="uploadfiles"><u style={{ cursor: 'pointer' }}>{files ? `Selected ${files} file${files == 1 ? '' : 's'}` : 'Select files'}</u>
        <input type="file" id="uploadfiles" name="files" onChange={handleChange} multiple={true} className="d-none" />
      </label>
      <button type="submit" className="btn btn-outline-primary d-inline-block ml-2 btn-sm" disabled={files ? false : true}>Upload</button>
      {progress != null ?
        <div className="progressOverlay">
          <div className="container-xl bg-light d-flex flex-column align-content-center m-6">
            <h2 className="text-center m-4">{progress.title}</h2>
            <div className="m-4">
              <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: Math.min(progress.percentage, 100) + "%" }}>{progress.percentage != 101 ? progress.percentage + '%' : ''}</div>
            </div>
          </div>
        </div> : ''
      }
    </form>
  )

}
