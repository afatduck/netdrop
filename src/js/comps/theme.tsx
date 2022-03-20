import React, { useState } from 'react'
import { useSelector } from 'react-redux'

export const ThemeButton = () => {

  const [dark, setDark]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState($("html")[0].getAttribute("data-theme") != "dark")
  const themeConsent = useSelector((state: RootState) => state.globals.consent.states)

  const handleClick = () => {

    setDark(!dark)
    const theme: string = dark ? 'dark' : 'light'
    $('html').attr("data-theme", theme)
    if (themeConsent) localStorage.setItem("theme", theme)

  }

  return <i className={'fas ' + (dark ? "fa-sun" : 'fa-moon')} id="theme-button" onClick={handleClick} />
}
