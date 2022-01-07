import { combineReducers } from 'redux'

import { globals } from './globals'
import { cdir, path, movePath } from './cdir'
import { progress } from './progress'
import { itemMenu } from './itemMenu'

export const reducers = combineReducers({
  globals: globals,
  cdir: cdir,
  path: path,
  movePath: movePath,
  progress: progress,
  itemmenu: itemMenu
})

export * from './init'
