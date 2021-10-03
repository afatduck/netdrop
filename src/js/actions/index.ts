import { Dispatch } from 'redux'

import { sortDirs } from '../utils'

export const updateError = (msg: string) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_ERROR',
      payload: msg
    })
  }

export const updateLevel = (lev: levels | '') =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_LEVEL',
      payload: lev
    })
  }

export const updateCdir = (d: directory[]) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_CDIR',
      payload: sortDirs(d)
    })
  }

export const updatePath = (f: string | 0) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: 'UPDATE_PATH',
      payload: f
    })
  }
