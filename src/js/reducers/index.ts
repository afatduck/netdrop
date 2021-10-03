import { combineReducers } from 'redux'

import { globals } from './globals'
import { cdir, path } from './cdir'

export const reducers = combineReducers({
  globals: globals,
  cdir: cdir,
  path: path
})

export * from './init'
