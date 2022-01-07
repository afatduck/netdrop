import download from 'downloadjs'

import { store } from '../store'
import { getBaseFtpRequest } from "../utils"

import * as StoreActions from '../actions/store-actions'

export const downloadItem = (getFile: string, isFolder: boolean): void => {

  const { updateError, updateProgress, updateLevel } = StoreActions

  const path = store.getState().path

  let fpath: string
  let mime: string
  let intervalID: ReturnType<typeof setInterval>

  updateProgress("Starting Download")
  updateProgress([101, 0])

  $.ajax(
    globalThis.apiLocation + 'download',
    {
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        ...getBaseFtpRequest(),
        Path: path.substr(1) + "/" + getFile,
      })
    })
    .done((data: DownloadFileResponse) => {

      if (!data.result) {
        updateError(data.errors[0])
        return
      }

      updateError('')
      fpath = data.url
      mime = data.mime

      updateProgress("Getting File" + (isFolder ? "s" : ''))

      intervalID = setInterval(() => {
        $.ajax(
          globalThis.apiLocation + 'downloadprogress',
          {
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(fpath)
          }
        )
          .done((data: ProgressResponse) => {

            if (!data.result) {
              updateError(`Failed to get file${isFolder ? "s" : ''}.`)
              updateProgress(null)
              clearInterval(intervalID)
              return
            }

            updateProgress([data.done, data.speed])

            if (data.complete) {

              clearInterval(intervalID)
              updateProgress("Downloading File" + (isFolder ? "s" : ''))

              let stopwatch: number = performance.now()
              let lastLoaded: number = 0

              let req = new XMLHttpRequest();

              req.addEventListener('progress', (e: ProgressEvent<XMLHttpRequestEventTarget>) => {

                try {
                  updateProgress([Math.round(e.loaded / e.total * 100), (e.loaded - lastLoaded) / ((performance.now() - stopwatch) / 1000)])
                } catch { }

                stopwatch = performance.now()
                lastLoaded = e.loaded

              })

              req.onreadystatechange = () => {
                if (req.readyState === 4) {

                  if (Math.trunc(req.status / 100) == 2) {
                    setTimeout(() => {
                      download(req.response, getFile + (isFolder ? ".zip" : ""), mime)
                    }, 0)
                  }
                  else { updateError("Something went wrong.") }

                  updateProgress(null)
                }
              }

              req.responseType = 'blob'
              req.open('get', globalThis.apiLocation + fpath + (isFolder ? ".zip" : ""))
              req.setRequestHeader('Accept', '*/*')

              req.send()

              return

            }

            if (data.done == 100) {
              updateProgress("Compressing Files")
              updateProgress([101, 0])
            }

          })
          .fail(() => {
            updateLevel("CONNECTING")
            clearInterval(intervalID)
          })


      }, 750)


    })
    .fail(() => { updateLevel("CONNECTING") })
}
