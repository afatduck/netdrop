import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import guidePages from '../json/guide.json'

const guideSaved: string = localStorage.getItem("guide") || "0"
const guideState: GuideState = guideSaved == "done" ? "done" : parseInt(guideSaved)

export const GuideButton = () => {

  const guideConsent = useSelector((state: RootState) => state.globals.consent.states)
  const [state, setState]: [GuideState, React.Dispatch<React.SetStateAction<GuideState>>] = useState(guideState)

  useEffect(() => {

    if (guideConsent) localStorage.setItem("guide", state.toString())

    $('.guide-highligh').removeClass("guide-highligh")

    if (state == "done") {
      return
    }

    $(guidePages[state].highlight).addClass("guide-highligh")

  }, [state])

  useEffect(() => {
    for (const g of guidePages) {
      if (g.image) {
        const loader = new Image()
        loader.src = `static/guide/${g.image}`
      }
    }
  }, [])

  const p = state == "done" ? null : guidePages[state]

  let texts: JSX.Element[] = []
  if (p) {
    for (let t of p.text) {
      texts.push(<p>{t}</p>)
    }
  }

  const handleBack = () => {
    setState((state as number) - 1)
  }

  const handleNext = () => {
    if (state == (guidePages.length - 1)) {
      setState("done")
      return
    }
    setState((state as number) + 1)
  }

  const handleSkip = () => {
    setState("done")
  }

  const page = !p ? null :
    <div className="overlay overlay--strong">
      <div id="guide-inner">
        <h2>{p.title}</h2>
        {texts}
        {!p.image ? null : <img src={`static/guide/${p.image}`} alt="Guide image" />}
        <div className="buttons">
          <button type="button" className="button-clear" name="back" onClick={handleBack} disabled={!state}>Back</button>
          <button type="button" className="button-clear" name="next" onClick={handleNext}>{state == (guidePages.length - 1) ? "Finish" : "Next"}</button>
          <button type="button" className="button-clear" name="skip" onClick={handleSkip}>Skip</button>
        </div>
      </div>
    </div>

  return <div id="hold-guide">
    <i className="fas fa-info-circle ml-auto" id="guide-button" onClick={() => { setState(0) }} />
    {page}
  </div>

}
