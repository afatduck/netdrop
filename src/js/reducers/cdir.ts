import { pathChange } from '../utils'

export const cdir = (state: directory[] = null, action: { type: string, payload: directory[] }): directory[] =>
  action.payload && action.type == "UPDATE_CDIR" && state != action.payload ? action.payload : state

export const path = (state: string = '.', action: { type: string, payload: string | 0 }): string =>
  action.type == 'UPDATE_PATH' ?
    pathChange(state, action.payload)
    :
    state
