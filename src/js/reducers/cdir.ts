import { pathChange, sortDirs } from '../utils'

export const cdir = (state: directory[] = null, action: Action<directory[] | directory | null>): directory[] => {
  if (action.payload && action.type == "UPDATE_CDIR" && state != action.payload) {
    if (Array.isArray(action.payload)) { return sortDirs(action.payload) }
    state.push(action.payload)
    return sortDirs([...state])
  }
  else if (["UPDATE_LEVEL", "UPDATE_CDIR"].includes(action.type)) return null
  return state
}

export const path = (state: string = sessionStorage.getItem("path") || ".", action: Action<[string | 0 | -1, boolean]>): string =>{
  if (action.type == 'UPDATE_PATH'){  
    const newPath = action.payload[0] == -1 ?
      '.'
      :
      pathChange(state, action.payload[0])
    if (action.payload[1]) sessionStorage.setItem("path", newPath)
    return newPath
  }
  return state
}

export const movePath = (state: string = '', action: Action<string>): string =>
  action.type == 'UPDATE_MOVEPATH' ? action.payload : state
