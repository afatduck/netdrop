import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

export const DeleteItem = (props: { name: string }) => {

  const { path, cdir } = useSelector((state: RootState) => state)

  const dispatch = useDispatch()
  const { updateError, updateCdir, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading(true)
    $.ajax({
      type: "POST",
      url: globalThis.apiLocation + 'delete',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify({
        Path: '/' + path + '/' + props.name,
        Host: localStorage.getItem('host'),
        Username: localStorage.getItem('user'),
        Password: globalThis.ftpPassword
      })
    })
      .fail(() => {
        updateLevel("CONNECTING")
      })
      .done((data: BaseResponse) => {
        setLoading(false)
        if (!data.result) {
          updateError(data.errors[0])
          return
        }
        updateCdir(cdir.filter((c: directory) => c.name != props.name))
        updateError('')
      })
  }

  return (
    loading ?
      <div className="spinner-border spinner-border-sm ml-4" role="status">
        <span className="sr-only"></span>
      </div>
      :
      <i className="fas fa-trash ml-4" onClick={handleClick}></i>
  )

}
