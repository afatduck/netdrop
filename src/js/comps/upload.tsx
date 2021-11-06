import React, { useState } from 'react'

import { ProgressOverlay } from './progress'
import { uploadFiles } from './uploadfiles'

export const UploadFile = () => {

  const [files, setFiles]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files.length)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    uploadFiles(($('#uploadfiles')[0] as HTMLInputElement).files)
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
