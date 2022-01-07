import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import { listdir } from './listdir'
import { getBaseFtpRequest } from '../utils'

import * as ActionCreators from '../actions'

export const MoveButton = () => {

  const { path, movePath } = useSelector((state: RootState) => state)

  const dispatch = useDispatch()
  const { updateMovePath, updateError, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)

  const handleClick = () => {
    setLoading(true)
    $.ajax({
      type: "POST",
      url: globalThis.apiLocation + 'move',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify({
        ...getBaseFtpRequest(),
        Source: movePath,
        Destination: path.substr(2) + '/' + name + movePath.substr(movePath.lastIndexOf("/"))
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
        listdir()
        updateError('')
        updateMovePath(null)
      })
  }

  return (
    loading ? <div className="loader mr-4 ml-auto" /> :
      <button
        className="button-small mr-2 ml-auto"
        disabled={!movePath}
        name="move"
        onClick={handleClick}
      >Paste
    </button>
  )

}
