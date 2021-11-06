import { store } from '../store'

export const updateError = (payload: string) => {
  store.dispatch({
    type: "UPDATE_ERROR",
    payload: payload
  })
}

export const updateProgress = (payload: string | number | progress | null) => {
  store.dispatch({
    type: "UPDATE_PROGRESS",
    payload: payload
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
