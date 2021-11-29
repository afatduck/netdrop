import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { bindActionCreators } from 'redux'

import { getBaseFtpRequest } from '../utils'

import * as ActionCreators from '../actions'

export const ImageView = (props: { name: string }) => {

  const [view, setView]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [imgUrl, setImgUrl]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(null)

  const { name } = props

  const { path } = useSelector((state: RootState) => state)
  const dispatch = useDispatch()
  const { updateError, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const handleClick = () => {

    setView(true)

    $.ajax({
      url: globalThis.apiLocation + "imageview",
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      timeout: 6e4,
      data: JSON.stringify({
        Path: path.substr(1) + '/' + name,
        ...getBaseFtpRequest()
      })
    })
      .done((data: ImageViewResponse) => {
        if (!data.result) {
          updateError(data.errors[0])
          return
        }
        setImgUrl(data.url)
        updateError('')
      })
      .fail(() => { updateLevel("CONNECTING") })

  }

  return (
    <div>
      <button type="button" className="button-clear" onClick={handleClick}>View</button>
      {
        !view ? null :
          <div className="overlay">
            <div className="hold-image-view">
              <i className="fas fa-times" onClick={() => { setView(false) }} />
              {
                !imgUrl ? <div className="loader" /> :
                  <img src={globalThis.apiLocation + imgUrl} />
              }
            </div>
          </div>
      }
    </div>
  )

}
