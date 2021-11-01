import { Dispatch } from 'redux'

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

export const updateCdir = (d: directory[] | directory) =>
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
      payload: f
    })
  }

export const updateProgress = (f: string | number | progress | null) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: f
    })
  }
