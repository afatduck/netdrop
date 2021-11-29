import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getBaseFtpRequest } from '../utils'

import * as ActionCreators from '../actions'

export const DeleteItem = (props: { name: string, setLoading: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const { name, setLoading } = props

  const { path, cdir } = useSelector((state: RootState) => state)

  const dispatch = useDispatch()
  const { updateError, updateCdir, updateLevel, updateItemMenu } = bindActionCreators(ActionCreators, dispatch)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setLoading(true)
    $.ajax({
      type: "POST",
      url: globalThis.apiLocation + 'delete',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      data: JSON.stringify({
        ...getBaseFtpRequest(),
        Path: path.substr(2) + '/' + name
      })
    })
      .fail(() => {
        updateLevel("CONNECTING")
      })
      .done((data: BaseResponse) => {
        setLoading(false)
        updateItemMenu(null)
        if (!data.result) {
          updateError(data.errors[0])
          return
        }
        updateCdir(cdir.filter((c: directory) => c.name != name))
        updateError('')
      })
  }

  return <button type="button" className="button-clear" name="delete" onClick={handleClick}>Delete</button>

}
