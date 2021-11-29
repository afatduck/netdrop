import React from 'react'
import { useSelector } from 'react-redux'

export const ProgressOverlay = () => {

  const progress = useSelector((state: RootState) => state.progress)

  return (
    progress != null ?
      <div className="progressOverlay">
        <div className="progress-bg ml-auto mr-auto">
          <h2 className="mb-3">{progress.title}</h2>
          <p className="mt-4">{progress.speed ? progress.speed + "/s" : ''}</p>
          <div className="progress">
            <div className="bar" style={{ width: progress.percentage + "%" }}>
              <span>{progress.percentage}%</span>
            </div>
          </div>
        </div>
      </div> : null
  )

}
