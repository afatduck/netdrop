import React, { useState } from 'react'
import { useSelector } from 'react-redux'

export const UploadFile = () => {

  const path = useSelector((state: RootState) => state.path)

  const [files, setFiles]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files.length)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let data: FormData = new FormData()
    for (let i = 0; i < ($('#uploadfiles')[0] as HTMLInputElement).files.length; i++) {
      data.append('files', ($('#uploadfiles')[0] as HTMLInputElement).files[i])
    }
    data.append('dataJson', JSON.stringify({
      path: path.substr(1),
      host: localStorage.getItem('host'),
      user: localStorage.getItem('user'),
      pword: localStorage.getItem('pword')
    }))
    $.ajax({
      type: 'POST',
      url: globalThis.apiLocation + 'upload',
      contentType: false,
      processData: false,
      data: data
    })
  }

  return (
    <form className="form-inline" onSubmit={handleSubmit}>
      <label htmlFor="uploadfiles"><u style={{ cursor: 'pointer' }}>{files ? `Selected ${files} file${files == 1 ? '' : 's'}` : 'Select files'}</u>
        <input type="file" id="uploadfiles" name="files" onChange={handleChange} multiple={true} className="d-none" />
      </label>
      <button type="submit" className="btn btn-outline-primary d-inline-block ml-2 btn-sm" disabled={files ? false : true}>Upload</button>
    </form>
  )

}
