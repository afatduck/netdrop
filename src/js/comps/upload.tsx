import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

import { ProgressOverlay } from './progress'

export const UploadFile = () => {

  const path = useSelector((state: RootState) => state.path)

  const dispatch = useDispatch()
  const { updateError, updateProgress, updateCdir, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const [files, setFiles]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0)

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
      pword: globalThis.ftpPassword
    }))
    updateProgress({
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
              updateProgress({
                title: 'Copying files...',
                percentage: 101
              })
            }
            updateProgress(percentComplete)
          }
        }, false);
        return xhr;
      },
      type: 'POST',
      url: globalThis.apiLocation + 'upload',
      contentType: false,
      processData: false,
      data: fd
    })
      .fail(() => {
        updateLevel("CONNECTING")
      })
      .done((data: string) => {
        let interval: ReturnType<typeof setInterval>
        updateProgress({
          title: 'Transfering files...',
          percentage: 0
        })
        interval = setInterval(() => {
          $.ajax({
            url: globalThis.apiLocation + 'checkupload',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            processData: false,
            data: JSON.stringify(data),
            success: (perData: string) => {
              const percentage = JSON.parse(perData)

              if (percentage == -1 || percentage == 100) {
                clearInterval(interval)
                updateProgress(null)
                updateError(percentage == -1 ? 'Something went wrong.' : '')

                $.ajax(
                  globalThis.apiLocation + 'listdir',
                  {
                    type: "POST",
                    data: JSON.stringify({
                      Host: localStorage.getItem('host'),
                      Username: localStorage.getItem('user'),
                      Password: globalThis.ftpPassword,
                      Secure: localStorage.getItem('secure') == "true",
                      Path: path.substr(2)
                    }),
                    processData: false,
                    contentType: 'application/json; charset=utf-8'
                  })
                  .done((data: ListDirRespone) => {
                    if (!data.result) {
                      updateError(data.errors[0])
                      return
                    }
                    updateCdir(data.dirList)
                    $('#dirlist')[0].scrollTop = 0
                  })
                  .fail(() => {
                    updateLevel("CONNECTING")
                  })

                return
              }

              updateProgress(percentage)

            }
          })
        }, 750)
      })
  }

  return (
    <form className="form-inline" onSubmit={handleSubmit}>
      <label htmlFor="uploadfiles"><u style={{ cursor: 'pointer' }}>{files ? `Selected ${files} file${files == 1 ? '' : 's'}` : 'Select files'}</u>
        <input type="file" id="uploadfiles" name="files" onChange={handleChange} multiple={true} className="d-none" />
      </label>
      <button type="submit" className="btn btn-outline-primary d-inline-block ml-2 btn-sm" disabled={files ? false : true}>Upload</button>
      <ProgressOverlay />
    </form>
  )

}
