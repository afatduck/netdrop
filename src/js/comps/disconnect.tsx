import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from "../actions"

export default function DisconnectButton() {

  const sessionConnectionConsent = useSelector((state: RootState) => state.globals.consent.connectionCookie)

  const dispatch = useDispatch()
  const { updateCdir, updateLevel, updatePath } = bindActionCreators(ActionCreators, dispatch)

  const handleClick = () => {

    globalThis.ftpHost = undefined
    globalThis.ftpUser = undefined 
    globalThis.ftpPassword = undefined
    globalThis.ftpSecure = undefined
    globalThis.ftpPort = undefined
    updatePath(-1)
    updateCdir(null)

    const con = sessionStorage.getItem("connection") || ""

    if (sessionConnectionConsent) {

        $.ajax({
            url: globalThis.apiLocation + "disconnect",
            method: "post",
            processData: false,
            data: JSON.stringify(con),
            contentType: "application/json; charset=utf-8"
        }).fail(() => {
            updateLevel("CONNECTING")
        })

    }

    sessionStorage.removeItem("connection")

  }

  return (
      <div style={{display: "flex", flexDirection: "row-reverse"}}>
        <button className='button-small' onClick={handleClick}>
            Disconnect
        </button>
      </div>
    
  )
}
