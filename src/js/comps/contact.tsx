import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'
import { listdir } from './listdir'

export const ContactApi = () => {

  const credsConsent = useSelector((state: RootState) => state.globals.consent.creds)

  const dispatch = useDispatch()
  const { updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(true)

  const tryToConnect = (): void => {
    setLoading(true)
    $.ajax({
      url: globalThis.apiLocation,
      type: 'GET',
      timeout: 2e4
    })
      .fail(() => {
        setLoading(false)
      })
      .done((data: ContactResponse) => {
        updateLevel('USING')
        if (data.connectionFound) {

          if (credsConsent) {
            localStorage.setItem('user', data.username)
            localStorage.setItem('host', data.host)
            localStorage.setItem('secure', data.secure ? "true" : "false")
            localStorage.setItem('port', data.port.toString())
          }

          globalThis.ftpHost = data.host
          globalThis.ftpUser = data.username 
          globalThis.ftpPassword = data.password
          globalThis.ftpSecure = data.secure
          globalThis.ftpPort = data.port
          
          listdir(undefined, true)
        }
        if (sessionStorage.getItem("connection")) listdir(undefined, true)
      })
  }

  const handleButton = () => { tryToConnect() }

  useEffect(() => {
    tryToConnect()
  }, [])

  return (
    <div className="text-center center" id="contact">
      <h3>{loading ? "Connecting to Netdrop..." : "Failed to connect to Netdrop."}</h3>
      {loading ?
        <div className="loader center mt-5" />
        :
        <div>
          <p>In order to use Netdrop it must connect to its API, the connection is likely failing due to one of the following reasons:</p>
          <ul>
            <li>The app is still in development so the API isn't always avaliable.</li>
            <li>You don't have internet access.</li>
            <li>Your browser is blocking requests, in which case you have problems with other websites too.</li>
          </ul>
          <button type="button" className="button-highlight" onClick={handleButton}>Try Again</button>
        </div>
      }
    </div>
  )

}
