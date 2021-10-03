import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import download from 'downloadjs'

import { styleModifyDate, pathChange } from '../utils'
import * as ActionCreators from '../actions'

export const DirList = () => {

  const { cdir, path } = useSelector((state: RootState) => state)

  const dispatch = useDispatch()
  const { updatePath, updateCdir, updateError } = bindActionCreators(ActionCreators, dispatch)

  const handleFolder = (e: React.MouseEvent) => {

    let newPath: string | 0 = e.currentTarget.getAttribute('data-dir')

    $.post(
      location.href,
      {
        rest: true,
        path: pathChange(path, newPath)
      },
      (data: string | directory[]) => {
        data = JSON.parse(data as string)
        if (typeof data === 'string') {
          updateError(data)
          return
        }
        updatePath(newPath)
        updateCdir(data)
        updateError('')
      }
    )

  }

  const handleFile = (e: React.MouseEvent) => {

    let getFile: string = e.currentTarget.getAttribute('data-dir')
    let fpath: string
    let mime: string
    let intervalID: ReturnType<typeof setInterval>

    $.post(
      location.href,
      {
        rest: true,
        filepath: path + '/' + getFile
      },
      data => {
        data = JSON.parse(data)
        if (data.error) {
          updateError(data.error)
          return
        }
        updateError('')
        fpath = data.url
        mime = data.mime

        intervalID = setInterval(() => {
          $.post(
            location.href,
            {
              rest: true,
              progress: fpath
            },
            data => {
              console.log(data);
              if (parseInt(data) == 100) { clearInterval(intervalID) }
            }
          )
        }, 750)
      }
    )

    //     const x = new XMLHttpRequest()
    //     x.open("GET", data.url, true)
    //     x.responseType = 'blob'
    //     x.onload = (e: ProgressEvent<XMLHttpRequest>) => download(e.target.response, getFile, (data as filelink).mime ? ((data as filelink).mime as string) : 'application/octet-stream')
    //     x.send()

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
        <span>{c.name}</span>
        <span className='badge badge-secondary'>{styleModifyDate(c.modify)}</span>
      </li>
    )
  }

  return (
    <ul className='mt-5 list-group'>
      {items}
    </ul>
  )

}
