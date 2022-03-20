import React from 'react'
import { render } from 'react-dom'
import { Provider, useSelector } from 'react-redux'

import { store } from './store'
import { ContactApi } from './comps/contact'
import { LoginForm } from './comps/login'
import { DirList } from './comps/dirlist'
import { Account } from './comps/account'
import { ThemeButton } from './comps/theme'
import { ProgressOverlay } from './comps/progress'
import { ItemMenu } from './comps/itemmenu'
import { GuideButton } from './comps/guide'
import ConsentOverlay from './comps/consent'

globalThis.apiLocation = 'https://netdrop.azurewebsites.net/api/'

$(document).ready(() => {

  $.ajaxSetup({
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
  })

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

    const { globals } = useSelector((state: RootState) => state)

    return (
      <div>
        <nav>

          <div id="nav-title">
            <svg viewBox="0 0 700 700">
              <use href="static/icons/logo.svg#logo"></use>
            </svg>
            <h3>Netdrop</h3>
          </div>

          <div>
            {
              globals.state == "USING" && globals.consent.jwtCookie ? <Account /> : null
            }
            {
              globals.state == "USING" ? <LoginForm /> : null

            }
          </div>

        </nav>

        {globals.state == "CONNECTING" ? null : <GuideButton />}

        <section id="content" className="center">
          {globals.state != "CONNECTING" ? null : <ContactApi />}
          {globals.state == "CONNECTING" ? null : <DirList />}
          <h5 className='text-error mt-3'>{globals.error}</h5>
        </section>
        <ConsentOverlay />
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
