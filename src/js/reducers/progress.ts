export const progress = (state: progress = null, action: Action<string | [number, string] | null | states>): progress => {
  if (action.type == "UPDATE_PROGRESS") {

    if (state == null) {
      state = {
        title: '',
        speed: '',
        percentage: 0
      }
    }

    switch (typeof action.payload) {

      case 'string':
        state.title = action.payload
        state.percentage = 0
        state.speed = ""
        return { ...state }

      case 'object':
        if (!action.payload) { return null }
        state.percentage = action.payload[0]
        state.speed = action.payload[1]
        return { ...state }

    }
  }

  if (action.type == "UPDATE_LEVEL" && action.payload == "CONNECTING") {
    return null
  }

  return state
}
