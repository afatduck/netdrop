import { pathChange, sortDirs } from '../utils'

export const cdir = (state: directory[] = null, action: Action<directory[] | directory>): directory[] => {
  if (action.payload && action.type == "UPDATE_CDIR" && state != action.payload) {
    if (Array.isArray(action.payload)) { return sortDirs(action.payload) }
    state.push(action.payload)
    return sortDirs([...state])
  }
  else if (action.type == "UPDATE_LEVEL") { return null }
  return state
}

export const path = (state: string = '.', action: Action<string | 0 | -1>): string =>
  action.type == 'UPDATE_PATH' ?
    action.payload == -1 ?
      '.'
      :
      pathChange(state, action.payload)
    :
    state
