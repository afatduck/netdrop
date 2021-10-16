import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import download from 'downloadjs'

import { pathChange } from '../utils'
import * as ActionCreators from '../actions'

import { filesize } from '../utils'
import { Rename } from './rename'

export const DirList = () => {

  const { cdir, path } = useSelector((state: RootState) => state)

  const dispatch = useDispatch()
  const { updatePath, updateCdir, updateError } = bindActionCreators(ActionCreators, dispatch)

  const [progress, setProgress]: [progress, React.Dispatch<React.SetStateAction<progress>>] = useState(null)

  const handleFolder = (e: React.MouseEvent) => {

    let newPath: string | 0 = e.currentTarget.getAttribute('data-dir')

    $.ajax(
      globalThis.apiLocation + 'listdir',
      {
        type: "POST",
        data: JSON.stringify({
          host: localStorage.getItem('host'),
          user: localStorage.getItem('user'),
          pword: localStorage.getItem('pword'),
          path: pathChange(path, newPath)
        }),
        processData: false,
        contentType: 'application/json; charset=utf-8',
        success: (data: string | directory[]) => {
          data = JSON.parse(data as string)
          if (typeof data === 'string') {
            updateError(data)
            return
          }
          updatePath(newPath)
          updateCdir(data)
          updateError('')
        }
      }
    )

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
          pword: localStorage.getItem('pword')
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

          setProgress({
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
                  setProgress(p => {
                    p.percentage = Math.round(data / fsize * 100)
                    return { ...p }
                  })

                  if (data == fsize) {

                    clearInterval(intervalID)
                    setProgress({
                      title: "Downloading File",
                      percentage: 0
                    })

                    let req = new XMLHttpRequest();

                    req.addEventListener('progress', (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
                      setProgress(p => {
                        p.percentage = Math.round(e.loaded / e.total * 100)
                        return { ...p }
                      })
                      if (e.loaded == e.total) {
                        download(req.response, getFile, mime)
                        setProgress(null)
                      }
                    })

                    req.responseType = 'blob'

                    req.open('get', globalThis.apiLocation + fpath)

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
        <span className='badge badge-secondary'>{c.modify}</span>
      </li>
    )
  }

  return (
    <ul className='mt-5 list-group'>
      {items}
      {progress != null ?
        <div style={{ position: 'fixed', width: "100vw", height: "100vh", boxSizing: 'border-box', padding: '35vh 10vw', backgroundColor: 'rgba(128, 128, 128, 0.4)', top: 0, left: 0 }}>
          <div className="container-xl bg-light d-flex flex-column align-content-center m-6">
            <h2 className="text-center m-4">{progress.title}</h2>
            <div className="m-4">
              <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: progress.percentage + "%" }}>{progress.percentage}%</div>
            </div>
          </div>
        </div> : ''
      }
    </ul>
  )

}
