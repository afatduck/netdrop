import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as ActionCreators from '../actions'

import consentInfo from "../json/consent.json"

export default function ConsentOverlay() {

    const dispatch = useDispatch()
    const { updateConsent } = bindActionCreators(ActionCreators, dispatch)

    const consent = useSelector((state: RootState) => state.globals.consent)
    const [deny, setDeny]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)

    const [input, setInput]: [CookieConsentInterface, Dispatch<SetStateAction<CookieConsentInterface>>] = useState({
        consent: true,
        states: true,
        creds: true,
        connectionSession: true,
        connectionCookie: true,
        jwtCookie: true
    })

    if (deny || consent.consent) return null

    const allOrSome = (): string => {
        for (const key in input) {        
            const val = input[key]
            if (!val) return "Accept Some" 
        }
        return "Accept All"
    }

    const inputMap: ConsentMap[] = []
    for (const key in input) {
        inputMap.push({
            key: key,
            value: input[key]
        })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        if (name == "consent") {return}
        setInput(p => {
            p[name] = checked
            return {...p}
        })

        if (checked) return
        const allBoxes = $("#consent-inner input")
        const id = allBoxes.index(e.target);
        for (const i in consentInfo) {
            const info = consentInfo[i]        
            if (info.needs == id) {             
                setInput(p => {
                    p[inputMap[i].key] = false
                    return {...p}
                })
            }
        }
    }

    const preferences: JSX.Element[] = []
    for (const i in consentInfo) {

        const info = consentInfo[i]
        const cin = inputMap[i]

        preferences.push(
            <div>
                <div>
                    <h3>{info.name}</h3>
                    <p>{info.details}</p>
                    <h6>Uses: {info.type}</h6>
                </div>
                <label className='checkbox-container' htmlFor={"conset-" + cin.key}>
                    <input type="checkbox" 
                    checked={cin.value} 
                    name={cin.key} 
                    onChange={handleChange}
                    disabled={i == "0" || (info.needs ? !inputMap[info.needs].value : false)}
                    id={"conset-" + cin.key} />
                    <span className='checkmark' />
                </label>
            </div>
        )
    }

  return (
    <div className='overlay overlay--strong'>
      <div id="consent-inner">
        <h2>Privacy Settings</h2>
        <p>
            For Netdrop to function properly, it requires saving some data on your device. 
            If you deny, you can still use Netdrop, but with limited features and wrose 
            performance. All settings are first-party.
        </p>
        <details>
            <summary>Manage preferences</summary>
            {preferences}
        </details>
        <div className='buttons mt-5'>
            <button type="button" onClick={() => {setDeny(true)}}>deny all</button>
            <button type='button' className='button-highlight' onClick={() => {updateConsent(input)}}>{allOrSome()}</button>
        </div>
      </div>
    </div>
  )
}
