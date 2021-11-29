import { store } from '../store'
import { filesize } from '../utils'

export const updateError = (payload: string) => {
  store.dispatch({
    type: "UPDATE_ERROR",
    payload: payload
  })
}

export const updateProgress = (payload: string | [number, number] | null) => {
  store.dispatch({
    type: "UPDATE_PROGRESS",
    payload: Array.isArray(payload) ? [payload[0], filesize(payload[1])] : payload
  })
}

export const updateCdir = (payload: directory[] | directory) => {
  store.dispatch({
    type: "UPDATE_CDIR",
    payload: payload
  })
}

export const updateLevel = (payload: states) => {
  store.dispatch({
    type: "UPDATE_LEVEL",
    payload: payload
  })
}

export const updatePath = (payload: string | 0 | -1) => {
  store.dispatch({
    type: "UPDATE_PATH",
    payload: payload
  })
}

export const requestSwitch = () => {
  store.dispatch({
    type: "REQUEST_SWITCH",
    payload: null
  })
}
