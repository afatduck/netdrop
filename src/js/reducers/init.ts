const consentJson = localStorage.getItem("consent")
const consent: CookieConsentInterface = consentJson ? JSON.parse(consentJson) : {
  consent: false,
  states: false,
  creds: false,
  connectionSession: false,
  connectionCookie: false,
  jwtCookie: false
}

export const initGlobals: globals = {
  state: 'CONNECTING',
  error: '',
  user: null,
  request: false,
  consent: consent
}
