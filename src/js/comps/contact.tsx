import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

export const ContactApi = () => {

  const dispatch = useDispatch()
  const { updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(true)

  const tryToConnect = (): void => {
    setLoading(true)
    $.ajax({
      url: globalThis.apiLocation,
      type: 'GET',
      timeout: 1e4
    })
      .fail(() => {
        setLoading(false)
      })
      .done(() => {
        updateLevel('USING')
      })
  }

  const handleButton = () => { tryToConnect() }

  useEffect(() => {
    tryToConnect()
  }, [])

  return (
    <div>
      <h3>{loading ? "Connecting to Netdrop API." : "Failed to connect to Netdrop API."}</h3>
      {loading ?
        <div className="loader" />
        :
        <button type="button" className="btn btn-primary btn-sm" onClick={handleButton}>Try Again</button>
      }
    </div>
  )

}
