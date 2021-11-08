import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useDropzone } from 'react-dropzone'
import download from 'downloadjs'

import * as ActionCreators from '../actions'

import { filesize, pathChange, getBaseFtpRequest } from '../utils'
import { uploadFiles } from './uploadfiles'

import { Rename } from './rename'
import { DeleteItem } from './delete'
import { UploadFile } from './upload'
import { ProgressOverlay } from './progress'
import { CreateDir } from './createdir'

export const DirList = () => {

  const { cdir, path } = useSelector((state: RootState) => state)

  const dispatch = useDispatch()
  const { updatePath, updateCdir, updateError, updateProgress, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    uploadFiles((acceptedFiles as Files[]))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDrop
  })

  if (!cdir) { return null }

  const handleFolder = (e: React.MouseEvent) => {

    let newPath: string | 0 = e.currentTarget.getAttribute('data-dir')

    $.ajax(
      globalThis.apiLocation + 'listdir',
      {
        type: "POST",
        data: JSON.stringify({
          ...getBaseFtpRequest(),
          Path: pathChange(path, newPath).substr(2)
        }),
        processData: false,
        contentType: 'application/json; charset=utf-8'
      })
      .done((data: ListDirRespone) => {
        if (!data.result) {
          updateError(data.errors[0])
          return
        }
        updatePath(newPath)
        updateCdir(data.dirList)
        updateError('')
        $('#dirlist')[0].scrollTop = 0
      })
      .fail(() => { updateLevel("CONNECTING") })

  }

  const handleFile = (e: React.MouseEvent) => {

    let getFile: string = e.currentTarget.getAttribute('data-dir')
    let fpath: string
    let fsize: number
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
        fsize = data.size
        mime = data.mime

        updateProgress({
          title: "Getting File",
          percentage: 0
        })

        intervalID = setInterval(() => {
          $.ajax(
            globalThis.apiLocation + 'progress',
            {
              type: 'POST',
              contentType: "application/json; charset=utf-8",
              data: JSON.stringify(fpath)
            }
          )
            .done((data: ProgressResponse) => {

              if (!data.result) {
                updateError("Failed to get file.")
                clearInterval(intervalID)
                return
              }

              updateProgress(Math.round(data.done / fsize * 100))

              if (data.done == fsize) {

                clearInterval(intervalID)
                updateProgress({
                  title: "Downloading File",
                  percentage: 0
                })

                let req = new XMLHttpRequest();

                req.addEventListener('progress', (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
                  try {
                    updateProgress(Math.round(e.loaded / e.total * 100))
                  } catch { }
                  if (e.loaded == e.total) {
                    setTimeout(() => {
                      download(req.response, getFile, mime)
                    }, 0)
                    updateProgress(null)
                  }
                })

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

  let items: JSX.Element[] = path == '.' ? [] : [
    <li
      className={'list-group-item list-group-item-action d-flex justify-content-between align-items-center list-group-item-info'}
      data-dir={0}
      onClick={handleFolder}
      style={{ cursor: 'pointer' }}>
      <span>..</span>
      <span className='badge badge-secondary'>Parent Dir</span>
    </li>
  ]

  for (let c of cdir) {
    items.push(
      <li
        className={'list-group-item list-group-item-action d-flex justify-content-between align-items-center' + (c.type == 'dir' ? ' list-group-item-info' : '')}
        data-dir={c.name}
        onClick={c.type == 'dir' ? handleFolder : handleFile}
        style={{ cursor: 'pointer' }}>
        <Rename name={c.name} key={new Date().getTime()} />
        {c.type == 'file' ? <span style={{ margin: "0 1em 0 auto" }}>{filesize(parseInt(c.size))}</span> : ''}
        <span className='badge badge-secondary' style={c.type == 'dir' ? { marginLeft: 'auto' } : {}}>{c.modify}</span>
        <DeleteItem name={c.name} key={'d' + new Date().getTime()} />
      </li>
    )
  }

  return (
    <div className="mt-4">
      <div className="d-flex">
        <UploadFile key="uf" />
        <CreateDir key="cd" />
      </div>
      <ul className='mt-1 list-group' id="dirlist" >
        <div {...getRootProps({ className: "dropzone-root" })}><h2>DROP HERE TO UPLOAD</h2></div>
        {items}
        <ProgressOverlay />
      </ul>
      <span>{path}</span>
      <input {...getInputProps({ className: "d-hidden", onClick: e => e.preventDefault() })} />
    </div>
  )

}
