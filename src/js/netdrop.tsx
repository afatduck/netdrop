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

import * as ActionCreators from './actions'

globalThis.apiLocation = localStorage.getItem('apiLocation') || 'http://calc.world:5008/api/'

$(document).ready(() => {

  const App = () => {

    const dispatch = useDispatch()
    const { updateLevel } = bindActionCreators(ActionCreators, dispatch)

    const { globals } = useSelector((state: RootState) => state)

    const [localhost, setLocalhost]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(globalThis.apiLocation.includes('localhost'))
    const switchApi = () => {
      setLocalhost(!localhost)
      localStorage.setItem('apiLocation', `http://${!localhost ? 'localhost' : 'calc.world'}:5008/api/`)
      globalThis.apiLocation = localStorage.getItem('apiLocation')
      updateLevel("CONNECTING")
    }

    return (
      <div>
        <nav className="navbar navbar-extend-sm bg-light">
          <a className="navbar-brand mr-auto">Netdrop</a>

          {
            globals.state == "USING" ?
              <div className="row mr-2">
                <LoginForm />
                <Account key={localhost ? 'a' : 'B'} />
              </div>
              : null
          }

        </nav>
        <section className="container-fluid p-4">
          {(() => { if (globals.state == 'CONNECTING') { return <ContactApi key={localhost ? 'a' : 'B'} /> } })()}
          <DirList />
          <h5 className='text-danger mt-3'>{globals.error}</h5>
          <button type="button" className="btn btn-info btn-sm" onClick={switchApi} >{`Switch to ${localhost ? 'online' : 'localhost'} api`}</button>
          <br />
          <ResetButton />
        </section>
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
