import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { bindActionCreators } from 'redux'

import { getBaseFtpRequest } from '../utils'

import * as ActionCreators from '../actions'

export const ImageView = (props: { name: string }) => {

  const [view, setView]: [0 | 1 | 2 | 3, React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3>>] = useState(0)
  const [imgUrl, setImgUrl]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(null)

  const { name } = props

  const { path } = useSelector((state: RootState) => state)
  const dispatch = useDispatch()
  const { updateError, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const handleClick = () => {

    setView(1)

    $.ajax({
      url: globalThis.apiLocation + "view",
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      timeout: 6e4,
      data: JSON.stringify({
        Path: path.substr(1) + '/' + name,
        ...getBaseFtpRequest()
      })
    })
      .done((data: ViewResponse) => {
        if (!data.result) {
          updateError(data.errors[0])
          setView(0)
          return
        }
        setImgUrl(data.url)
        setView(2)
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
            <div className="hold-view">
              <i className="fas fa-times" onClick={() => { setView(0) }} />
              {view != 3 ? <div className="loader" /> : null}
              {view >= 2 ? <img src={globalThis.apiLocation + imgUrl} style={{ display: view == 3 ? "block" : "none" }} onLoad={() => { setView(3) }} /> : null}
            </div>
          </div>
      }
    </div>
  )

}
