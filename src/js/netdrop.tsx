import React, { useState } from 'react'
import { render } from 'react-dom'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import { store } from './store'
import { ResetButton } from './comps/small'
import { ContactApi } from './comps/contact'
import { LoginForm } from './comps/login'
import { DirList } from './comps/dirlist'
import { Account } from './comps/account'
import { ThemeButton } from './comps/theme'
import { ProgressOverlay } from './comps/progress'
import { ItemMenu } from './comps/itemmenu'

import * as ActionCreators from './actions'

globalThis.apiLocation = localStorage.getItem('apiLocation') || 'https://calc.world:5009/api/'

$(document).ready(() => {

  let dragTimeout: ReturnType<typeof setTimeout>
  $(document).on("dragover", (e: Event) => {
    e.preventDefault()
    $('.dropzone-root').css("z-index", 2)
    clearTimeout(dragTimeout)
    dragTimeout = setTimeout(() => { $('.dropzone-root').css("z-index", -1) }, 100)
  })

  $('html').attr("data-theme", localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"))

  const App = () => {

    const dispatch = useDispatch()
    const { updateLevel } = bindActionCreators(ActionCreators, dispatch)

    const { globals } = useSelector((state: RootState) => state)

    const [localhost, setLocalhost]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(globalThis.apiLocation.includes('localhost'))
    const switchApi = () => {
      setLocalhost(!localhost)
      localStorage.setItem('apiLocation', `https://${!localhost ? 'localhost' : 'calc.world'}:5009/api/`)
      globalThis.apiLocation = localStorage.getItem('apiLocation')
      updateLevel("CONNECTING")
    }

    return (
      <div>
        <nav className="row p-4 pt-3">

          <h3 className="column column-50">Netdrop</h3>

          {
            globals.state == "USING" ? <LoginForm /> : null

          }
          {
            globals.state == "USING" ? <Account key={localhost ? 'a' : 'B'} /> : null
          }

        </nav>
        <section className="container-fluid p-4">
          {(() => { if (globals.state == 'CONNECTING') { return <ContactApi key={localhost ? 'a' : 'B'} /> } })()}
          {globals.state == "CONNECTING" ? null : <DirList />}
          <h5 className='text-error mt-3'>{globals.error}</h5>
          <button type="button" className="btn btn-info btn-sm" onClick={switchApi} >{`Switch to ${localhost ? 'online' : 'localhost'} api`}</button>
          <br />
          <ResetButton />
        </section>
        <ProgressOverlay />
        <ThemeButton />
        <ItemMenu />

      </div>
    )
  }

  render(
    <Provider store={store}>
      <App />
    </Provider>
    ,
    $('#root')[0]
  )
})
