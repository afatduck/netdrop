import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'

import { ResetButton } from './comps/small'
import { HostForm } from './comps/host'
import { LoginForm } from './comps/login'

const App = () => {

  const [valid, setValid]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(null)
  const [level, setLevel]: [levels, React.Dispatch<React.SetStateAction<levels>>] = useState('HOST')

  useEffect(() => { if (!valid && valid != null) { setLevel('LOGIN') } }, [valid])

  return (
    <div>
      <HostForm update={setValid} />
      {(() => { if (level != 'HOST') { return <LoginForm update={setValid} /> } })()}
      <h5 className='text-info mt-3'>{valid}</h5>
      <ResetButton />
    </div>
  )
}

$(document).ready(() => {
  render(
    <App />,
    $('#root')[0]
  )
})
