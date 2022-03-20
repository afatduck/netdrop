import { Dispatch } from 'redux'
import { store } from '../store'

import { filesize } from '../utils'

export const updateError = (msg: string) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_ERROR',
      payload: msg
    })
  }

export const updateLevel = (state: states | '') =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_LEVEL',
      payload: state
    })
  }

export const updateUser = (user: UserData) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: user
    })
  }

export const updateCdir = (d: directory[] | directory | null) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_CDIR',
      payload: d
    })
  }

export const updatePath = (f: string | 0 | -1) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_PATH',
      payload: [f, store.getState().globals.consent.connectionSession]
    })
  }

export const updateProgress = (f: string | [number, number] | null) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: Array.isArray(f) ? [f[0], filesize(f[1])] : f
    })
  }

export const requestSwitch = () =>
  (dispatch: Dispatch) => {
    dispatch({
      type: "REQUEST_SWITCH",
      payload: null
    })
  }


export const updateItemMenu = (payload: itemMenu) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: "UPDATE_ITEMMENU",
      payload: payload
    })
  }

export const updateMovePath = (f: string) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_MOVEPATH',
      payload: f
    })
  }

  export const updateConsent = (payload: CookieConsentInterface) =>
  (dispatch: Dispatch) => {

    if (payload) {
      const consentJson = JSON.stringify(payload)
      localStorage.setItem("consent", consentJson)
    }

    dispatch({
      type: 'UPDATE_CONSENT',
      payload: payload
    })
  }