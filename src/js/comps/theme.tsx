import React, { useState } from 'react'

export const ThemeButton = () => {

  const [dark, setDark]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState($("html")[0].getAttribute("data-theme") != "dark")

  const handleClick = () => {

    setDark(!dark)
    const theme: string = dark ? 'dark' : 'light'
    $('html').attr("data-theme", theme)
    localStorage.setItem("theme", theme)

  }

  return <button type="button" className="button-small" id="theme-button" onClick={handleClick}>Switch Theme</button>
}
