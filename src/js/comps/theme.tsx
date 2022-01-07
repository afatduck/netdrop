import React, { useState } from 'react'

export const ThemeButton = () => {

  const [dark, setDark]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState($("html")[0].getAttribute("data-theme") != "dark")

  const handleClick = () => {

    setDark(!dark)
    const theme: string = dark ? 'dark' : 'light'
    $('html').attr("data-theme", theme)
    localStorage.setItem("theme", theme)

  }

  return <i className={'fas ' + (dark ? "fa-sun" : 'fa-moon')} id="theme-button" onClick={handleClick} />
}
