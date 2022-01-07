import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useDropzone } from 'react-dropzone'

import * as ActionCreators from '../actions'

import { filesize, pathChange } from '../utils'
import { uploadFiles } from './uploadfiles'
import { listdir } from './listdir'
import { downloadItem } from './download'

import { AddTab } from './add'

export const DirList = () => {

  const { cdir, path, globals } = useSelector((state: RootState) => state)

  const dispatch = useDispatch()
  const { updateItemMenu } = bindActionCreators(ActionCreators, dispatch)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    uploadFiles((acceptedFiles as Files[]))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDrop
  })

  if (!cdir) {
    return (
      <div id="no-connection">
        <h2>Not connected to FTP server.</h2>
        <p>Press the "new connection" button to start using the app.</p>
      </div>
    )
  }

  const handleFolder = (e: React.MouseEvent) => {

    let newPath: string | 0 = e.currentTarget.getAttribute('data-dir')

    listdir(pathChange(path, newPath).substr(2))

  }

  const handleFile = (e: React.MouseEvent) => {

    let getFile: string = e.currentTarget.getAttribute('data-dir')
    downloadItem(getFile, false)

  }

  const handleRightClick = (e: React.MouseEvent) => {
    e.stopPropagation()
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
      <td>..</td><td /><td /><td />
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
        <td><i className="fas fa-bars" data-id={i} onClick={handleRightClick} /></td>
      </tr>
    )
    i++
  }

  return (
    <div id="dir-root">
      <AddTab />
      <div id="hold-table">
        <div {...getRootProps({ className: "dropzone-root" })}><h3>DROP HERE TO UPLOAD</h3></div>
        <section>
          <table id="dir-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Modify</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items}
            </tbody>
          </table>
        </section>
      </div>
      <blockquote><em>{path.substr(1) || "/"}</em></blockquote>
      <input {...getInputProps({ onClick: e => e.preventDefault() })} />
    </div>
  )

}
