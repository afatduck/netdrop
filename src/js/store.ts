import { applyMiddleware, compose, createStore } from 'redux'
import { reducers, initGlobals } from './reducers'
import thunk from 'redux-thunk'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}

const composeEnchanters = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  reducers,
  {
    globals: initGlobals
  },
  compose(
    applyMiddleware(thunk),
    composeEnchanters()
  )
)
