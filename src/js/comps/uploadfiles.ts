import * as StoreActions from '../actions/store-actions'

import { store } from '../store'
import { listdir } from './listdir'
import { getBaseFtpRequest } from '../utils'

export const uploadFiles = (files: Files[] | FileList) => {

  const path = store.getState().path

  const { updateError, updateProgress, updateLevel } = StoreActions

  if (!files.length) { return }

  let pass: boolean = false
  let fname: string

  let fd: FormData = new FormData()
  for (let i = 0; i < files.length; i++) {
    if (!files[i].size) { continue }
    pass = true

    if (files[i]["path"]) {
      fname = files[i]["path"].replace("/", '')
    }
    else if (files[i]["webkitRelativePath"]) {
      fname = files[i]["webkitRelativePath"]
    }
    else {
      fname = files[i].name
    }

    fd.append('files', files[i], fname)
  }

  if (!pass) {
    updateError(`File${files.length > 1 ? 's' : ''} empty.`)
    return
  }

  fd.append('dataJson', JSON.stringify({
    Path: path.substr(1),
    ...getBaseFtpRequest()
  }))
  updateProgress("Uploading Files")
  $.ajax({
    xhr: () => {

      let stopwatch: number = performance.now()
      let lastLoaded: number = 0

      const xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function(e) {

        if (e.lengthComputable) {

          const percentComplete = Math.trunc((e.loaded / e.total) * 100);
          if (percentComplete == 100) {
            updateProgress("Copying Files...")
          }

          updateProgress([percentComplete, (e.loaded - lastLoaded) / ((performance.now() - stopwatch) / 1000)])

          stopwatch = performance.now()
          lastLoaded = e.loaded

        }

      }, false);
      return xhr;
    },
    type: 'POST',
    url: globalThis.apiLocation + 'upload',
    contentType: false,
    processData: false,
    data: fd
  })
    .fail(() => {
      updateLevel("CONNECTING")
    })
    .done((data: UploadResponse) => {

      if (!data.result) {
        updateError(data.errors.join("\n"))
        updateProgress(null)
        return
      }

      let interval: ReturnType<typeof setInterval>
      updateProgress("Transfering Files")
      interval = setInterval(() => {
        $.ajax({
          url: globalThis.apiLocation + 'uploadprogress',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          processData: false,
          data: JSON.stringify(data.code)
        })
          .done((progress: ProgressResponse) => {

            if (progress.done == -1 || progress.done == 100) {
              clearInterval(interval)
              updateProgress(null)
              updateError(progress.done == -1 ? 'Something went wrong.' : '')

              listdir()

              return
            }

            updateProgress([progress.done, progress.speed])

          })
      }, 750)
    })
    .fail(() => { updateLevel("CONNECTING") })

}
