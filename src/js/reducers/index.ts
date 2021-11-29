import { combineReducers } from 'redux'

import { globals } from './globals'
import { cdir, path } from './cdir'
import { progress } from './progress'
import { itemMenu } from './itemMenu'

export const reducers = combineReducers({
  globals: globals,
  cdir: cdir,
  path: path,
  progress: progress,
  itemmenu: itemMenu
})

export * from './init'
