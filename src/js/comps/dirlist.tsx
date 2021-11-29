import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useDropzone } from 'react-dropzone'
import download from 'downloadjs'

import * as ActionCreators from '../actions'

import { filesize, pathChange, getBaseFtpRequest } from '../utils'
import { uploadFiles } from './uploadfiles'
import { listdir } from './listdir'

import { AddTab } from './add'

export const DirList = () => {

  const { cdir, path, globals } = useSelector((state: RootState) => state)

  const dispatch = useDispatch()
  const { updateError, updateProgress, updateLevel, updateItemMenu } = bindActionCreators(ActionCreators, dispatch)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    uploadFiles((acceptedFiles as Files[]))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDrop
  })

  if (!cdir) { return null }

  const handleFolder = (e: React.MouseEvent) => {

    let newPath: string | 0 = e.currentTarget.getAttribute('data-dir')

    listdir(pathChange(path, newPath).substr(2))

  }

  const handleFile = (e: React.MouseEvent) => {

    let getFile: string = e.currentTarget.getAttribute('data-dir')
    let fpath: string
    let mime: string
    let intervalID: ReturnType<typeof setInterval>

    $.ajax(
      globalThis.apiLocation + 'download',
      {
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
          ...getBaseFtpRequest(),
          Path: path.substr(1) + "/" + getFile,
        })
      })
      .done((data: DownloadFileResponse) => {

        if (!data.result) {
          updateError(data.errors[0])
          return
        }

        updateError('')
        fpath = data.url
        mime = data.mime

        updateProgress("Getting File")

        intervalID = setInterval(() => {
          $.ajax(
            globalThis.apiLocation + 'downloadprogress',
            {
              type: 'POST',
              contentType: "application/json; charset=utf-8",
              data: JSON.stringify(fpath)
            }
          )
            .done((data: ProgressResponse) => {

              if (!data.result) {
                updateError("Failed to get file.")
                updateProgress(null)
                clearInterval(intervalID)
                return
              }

              updateProgress([data.done, data.speed])

              if (data.done == 100) {

                clearInterval(intervalID)
                updateProgress("Downloading File")

                let stopwatch: number = performance.now()
                let lastLoaded: number = 0

                let req = new XMLHttpRequest();

                req.addEventListener('progress', (e: ProgressEvent<XMLHttpRequestEventTarget>) => {

                  try {
                    updateProgress([Math.round(e.loaded / e.total * 100), (e.loaded - lastLoaded) / ((performance.now() - stopwatch) / 1000)])
                  } catch { }

                  stopwatch = performance.now()
                  lastLoaded = e.loaded

                })

                req.onreadystatechange = () => {
                  if (req.readyState === 4) {
                    setTimeout(() => {
                      download(req.response, getFile, mime)
                    }, 0)
                    updateProgress(null)
                  }
                }

                req.responseType = 'blob'
                req.open('get', globalThis.apiLocation + fpath)
                req.setRequestHeader('Accept', '*/*')

                req.send()

              }
            })
            .fail(() => {
              updateLevel("CONNECTING")
              clearInterval(intervalID)
            })


        }, 750)


      })
      .fail(() => { updateLevel("CONNECTING") })

  }

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (globals.request) { return }
    const index: number = parseInt(e.currentTarget.getAttribute("data-id"))
    updateItemMenu({
      x: e.clientX,
      y: e.clientY,
      item: cdir[index]
    })
  }

  let items: JSX.Element[] = path == '.' ? [] : [
    <tr
      className={'dir-item'}
      data-dir={0}
      onClick={handleFolder}
      style={{ cursor: 'pointer' }}>
      <td>..</td><td /><td />
    </tr>
  ]

  let i: number = 0

  for (let c of cdir) {
    items.push(
      <tr
        className={'dir-item'}
        data-dir={c.name}
        data-id={i}
        onClick={c.type == 'dir' ? handleFolder : handleFile}
        onContextMenu={handleRightClick}
        style={{ cursor: 'pointer' }}>
        <td>{c.name}</td>
        <td>{c.type == "file" ? filesize(parseInt(c.size)) || "0B" : "-"}</td>
        <td>{c.modify}</td>
      </tr>
    )
    i++
  }

  return (
    <div className="mt-4 dir-root">
      <AddTab />
      <div className="hold-table">
        <div {...getRootProps({ className: "dropzone-root" })}><h3>DROP HERE TO UPLOAD</h3></div>
        <section>
          <table className="dir-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              {items}
            </tbody>
          </table>
        </section>
      </div>
      <blockquote><em>{path.substr(1)}</em></blockquote>
      <input {...getInputProps({ onClick: e => e.preventDefault() })} />
    </div>
  )

}
