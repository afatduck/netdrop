export const globals = (state: globals = null, action: Action<string | states | UserData | CookieConsentInterface>): globals => {

  switch (action.type) {

    case 'REQUEST_SWITCH':
      state.request = !state.request
      return { ...state }

    case 'UPDATE_ERROR':
      state.error = action.payload as string
      return { ...state }

    case 'UPDATE_LEVEL':
      if (state.state == action.payload || action.payload == '') { return state }
      state.state = action.payload as states
      state.error = ""
      return { ...state }

    case 'UPDATE_USER':
      state.user = action.payload as UserData
      return { ...state }

    case 'UPDATE_CONSENT':
      state.consent = action.payload as CookieConsentInterface
      return {...state}

    default: return state
  }

}
