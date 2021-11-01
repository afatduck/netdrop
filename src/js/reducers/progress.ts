export const progress = (state: progress = null, action: Action<number | string | progress | null>): progress => {
  if (action.type == "UPDATE_PROGRESS") {
    switch (typeof action.payload) {

      case 'number':
        state.percentage = action.payload
        return { ...state }

      case 'string':
        state.title = action.payload
        return { ...state }

      case 'object':
        return action.payload

      default:
        return null
    }
  }
  return state
}
