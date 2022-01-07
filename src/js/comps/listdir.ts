import { store } from '../store'
import { getBaseFtpRequest } from '../utils'
import * as StoreActions from '../actions/store-actions'

const { updateError, updateCdir, updateLevel, updatePath, requestSwitch } = StoreActions

export const listdir = (path: string = store.getState().path) => {

  const p = store.getState().path
  const req = store.getState().globals.request

  if (req) { return }
  requestSwitch()

  return $.ajax(
    globalThis.apiLocation + 'listdir',
    {
      type: "POST",
      data: JSON.stringify({
        ...getBaseFtpRequest(),
        Path: path
      }),
      processData: false,
      contentType: 'application/json; charset=utf-8'
    })
    .done((data: ListDirRespone) => {
      if (!data.result) {
        updateError(data.errors[0])
        return
      }
      updateCdir(data.dirList)
      updateError('')
      if (path != p) {
        $('#hold-table section')[0].scrollTop = 0
        updatePath(p.length > path.length ? 0 : path.substr(path.lastIndexOf('/') + 1))
      }
    })
    .fail(() => { updateLevel("CONNECTING") })
    .always(() => {
      requestSwitch()
    })

}
