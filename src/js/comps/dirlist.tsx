import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import download from 'downloadjs'

import { pathChange } from '../utils'
import * as ActionCreators from '../actions'

import { filesize } from '../utils'
import { Rename } from './rename'
import { DeleteItem } from './delete'
import { UploadFile } from './upload'
import { ProgressOverlay } from './progress'
import { CreateDir } from './createdir'

export const DirList = () => {

  const { cdir, path } = useSelector((state: RootState) => state)

  const dispatch = useDispatch()
  const { updatePath, updateCdir, updateError, updateProgress } = bindActionCreators(ActionCreators, dispatch)

  if (!cdir) { return null }

  const handleFolder = (e: React.MouseEvent) => {

    let newPath: string | 0 = e.currentTarget.getAttribute('data-dir')

    $.ajax(
      globalThis.apiLocation + 'listdir',
      {
        type: "POST",
        data: JSON.stringify({
          Host: localStorage.getItem('host'),
          Username: localStorage.getItem('user'),
          Password: globalThis.ftpPassword,
          Secure: localStorage.getItem("Secure") == "true",
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
          path: localStorage.getItem('host') + path.replace('.', '') + "/" + getFile,
          user: localStorage.getItem('user'),
          pword: globalThis.ftpPassword
        }),
        success: data => {

          data = JSON.parse(data)
          if (data.error) {
            updateError(data.error)
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
                data: JSON.stringify(fpath),
                success: data => {
                  data = JSON.parse(data)
                  updateProgress(Math.round(data / fsize * 100))

                  if (data == fsize) {

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
                }
              }
            )
          }, 750)

        }

      }
    )
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
      <ul className='mt-1 list-group' id="dirlist">
        {items}
        <ProgressOverlay />
      </ul>
      <span>{path}</span>
    </div>
  )

}
