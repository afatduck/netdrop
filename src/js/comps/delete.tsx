import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getBaseFtpRequest } from '../utils'

import * as ActionCreators from '../actions'

export const DeleteItem = (props: { name: string, setLoading: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const { name, setLoading } = props

  const { path, cdir } = useSelector((state: RootState) => state)

  const dispatch = useDispatch()
  const { updateError, updateCdir, updateLevel, updateItemMenu } = bindActionCreators(ActionCreators, dispatch)

  const [confirm, setConfim]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setConfim(false)
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setConfim(true)
  }

  const handleNo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setConfim(false)
  }

  return <>
  <button type="button" className="button-clear" name="delete" onClick={handleClick}>Delete</button>
  {
    !confirm ? null :
    <div className="overlay">
      <div id='delete-inner'>
        <i className="fas fa-times" onClick={() => { setConfim(false) }} />
        <h3>Are you sure you want to delete <em>{name}</em></h3>
        <div className='buttons'>
          <button type='button' name='yes' className='button-highlight' onClick={handleConfirm}>Yes</button>
          <button type='button' name='no' onClick={handleNo}>no</button>
        </div>
      </div>
    </div>
  }
  </>

}
