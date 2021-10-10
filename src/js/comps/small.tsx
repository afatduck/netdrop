import React from 'react'

export const ResetButton = () => {

  const handleClick = () => {
    localStorage.clear()
    location.reload()
  }

  return (
    <button onClick={handleClick} name="reset" className="btn btn-sm btn-warning mt-5">Reset</button>
  )

}
