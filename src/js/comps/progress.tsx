import React from 'react'
import { useSelector } from 'react-redux'

export const ProgressOverlay = () => {

  const progress = useSelector((state: RootState) => state.progress)

  return (
    progress != null ?
      <div className="progressOverlay">
        <div className="container-xl bg-light d-flex flex-column align-content-center m-6">
          <h2 className="text-center m-4">{progress.title}</h2>
          <div className="m-4">
            <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: progress.percentage + "%" }}>{progress.percentage}%</div>
          </div>
        </div>
      </div> : null
  )

}
