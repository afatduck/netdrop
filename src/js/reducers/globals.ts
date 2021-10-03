type globalsReducerType = 'UPDATE_ERROR' | 'UPDATE_LEVEL'

export const globals = (state: globals = null, action: { type: globalsReducerType, payload: string | levels }) => {

  switch (action.type) {

    case 'UPDATE_ERROR':
      state.error = action.payload
      return { ...state }

    case 'UPDATE_LEVEL':
      if (state.level == action.payload || action.payload == '') { return state }
      state.level = action.payload as levels
      return { ...state }

    default: return state
  }

}
