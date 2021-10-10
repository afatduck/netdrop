import React from 'react'
import { render } from 'react-dom'
import { Provider, useSelector } from 'react-redux'

import { store } from './store'
import { ResetButton } from './comps/small'
import { HostForm } from './comps/host'
import { LoginForm } from './comps/login'
import { DirList } from './comps/dirlist'

globalThis.apiLocation = 'http://calc.world:5008/api/'

$(document).ready(() => {

  const App = () => {

    const { globals } = useSelector((state: RootState) => state)

    return (
      <div>
        <HostForm />
        {(() => { if (globals.level != 'HOST') { return <LoginForm /> } })()}
        {(() => { if (globals.level == 'BROWSE') { return <DirList /> } })()}
        <h5 className='text-info mt-3'>{globals.error}</h5>
        <ResetButton />
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
