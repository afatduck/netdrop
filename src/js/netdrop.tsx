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
import { GuideButton } from './comps/guide'

import * as ActionCreators from './actions'

globalThis.apiLocation = localStorage.getItem('apiLocation') || 'https://netdrop.azurewebsites.net/api/'

$(document).ready(() => {

  let dragTimeout: ReturnType<typeof setTimeout>
  $(document).on("dragover", (e: Event) => {
    e.preventDefault()
    $('.dropzone-root').css("z-index", 2)
    clearTimeout(dragTimeout)
    dragTimeout = setTimeout(() => { $('.dropzone-root').css("z-index", -1) }, 100)
  })

  $('html').attr("data-theme", localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"))

  setTimeout(() => { $('html').attr("data-loaded", "") }, 200)

  const App = () => {

    const dispatch = useDispatch()
    const { updateLevel } = bindActionCreators(ActionCreators, dispatch)

    const { globals } = useSelector((state: RootState) => state)

    const [localhost, setLocalhost]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(globalThis.apiLocation.includes('localhost'))
    const switchApi = () => {
      setLocalhost(!localhost)
      localStorage.setItem('apiLocation', `https://${!localhost ? 'localhost:5009' : 'netdrop.azurewebsites.net'}/api/`)
      globalThis.apiLocation = localStorage.getItem('apiLocation')
      updateLevel("CONNECTING")
    }

    return (
      <div>
        <nav>

          <div id="nav-title" onClick={() => { location.reload() }}>
            <svg viewBox="0 0 700 700">
              <use href="static/icons/logo.svg#logo"></use>
            </svg>
            <h3>Netdrop</h3>
          </div>

          <div>
            {
              globals.state == "USING" ? <LoginForm /> : null

            }
            {
              globals.state == "USING" ? <Account key={localhost ? 'a' : 'B'} /> : null
            }
          </div>

        </nav>

        {globals.state == "CONNECTING" ? null : <GuideButton />}

        <section id="content" className="center">
          {globals.state != "CONNECTING" ? null : <ContactApi key={localhost ? 'a' : 'B'} />}
          {globals.state == "CONNECTING" ? null : <DirList />}
          <h5 className='text-error mt-3'>{globals.error}</h5>
        </section>
        <div id="dev-buttons">
          <p>Dev Buttons</p>
          <button type="button" className="button-small" onClick={switchApi} >{`Switch to ${localhost ? 'online' : 'localhost'} api`}</button>
          <ResetButton />
        </div>
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
