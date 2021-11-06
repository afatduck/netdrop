import * as StoreActions from '../actions/store-actions'

import { store } from '../store'

export const uploadFiles = (files: Files[] | FileList) => {

  const path = store.getState().path

  const { updateError, updateProgress, updateCdir, updateLevel } = StoreActions

  if (!files.length) { return }

  let pass: boolean = false

  let fd: FormData = new FormData()
  for (let i = 0; i < files.length; i++) {
    if (!files[i].size) { continue }
    pass = true
    fd.append('files', files[i], (files[i] as Files).path.replace("/", '') || files[i].name)
  }

  if (!pass) {
    updateError(`File${files.length > 1 ? 's' : ''} empty.`)
    return
  }

  fd.append('dataJson', JSON.stringify({
    host: localStorage.getItem('host') + path.substr(1),
    user: localStorage.getItem('user'),
    pword: globalThis.ftpPassword
  }))
  updateProgress({
    title: 'Uploading files...',
    percentage: 0
  })
  $.ajax({
    xhr: () => {
      const xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function(evt) {
        if (evt.lengthComputable) {
          let percentComplete = Math.trunc((evt.loaded / evt.total) * 100);
          if (percentComplete == 100) {
            updateProgress({
              title: 'Copying files...',
              percentage: 101
            })
          }
          updateProgress(percentComplete)
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
    .done((data: string) => {
      let interval: ReturnType<typeof setInterval>
      updateProgress({
        title: 'Transfering files...',
        percentage: 0
      })
      interval = setInterval(() => {
        $.ajax({
          url: globalThis.apiLocation + 'checkupload',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          processData: false,
          data: JSON.stringify(data)
        })
          .done((percentage: number) => {

            if (percentage == -1 || percentage == 100) {
              clearInterval(interval)
              updateProgress(null)
              updateError(percentage == -1 ? 'Something went wrong.' : '')

              $.ajax(
                globalThis.apiLocation + 'listdir',
                {
                  type: "POST",
                  data: JSON.stringify({
                    Host: localStorage.getItem('host'),
                    Username: localStorage.getItem('user'),
                    Password: globalThis.ftpPassword,
                    Secure: localStorage.getItem('secure') == "true",
                    Path: path.substr(2)
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
                  $('#dirlist')[0].scrollTop = 0
                })
                .fail(() => {
                  updateLevel("CONNECTING")
                  clearInterval(interval)
                })

              return
            }

            updateProgress(percentage)

          })
      }, 750)
    })
    .fail(() => { updateLevel("CONNECTING") })

}
