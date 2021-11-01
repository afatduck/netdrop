export const globals = (state: globals = null, action: Action<string | states | UserData>): globals => {

  switch (action.type) {

    case 'UPDATE_ERROR':
      state.error = (action.payload as string)
      return { ...state }

    case 'UPDATE_LEVEL':
      if (state.state == action.payload || action.payload == '') { return state }
      state.state = action.payload as states
      return { ...state }

    case 'UPDATE_USER':
      state.user = (action.payload as UserData)
      return { ...state }

    default: return state
  }

}
