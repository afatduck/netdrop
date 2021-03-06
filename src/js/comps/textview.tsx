import React, { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { bindActionCreators } from 'redux'
import hljs from 'highlight.js'
import CodeEditor from '@uiw/react-textarea-code-editor';

import { getBaseFtpRequest } from '../utils'
import text_themes from '../json/textThemes.json'

import * as ActionCreators from '../actions'

import { listdir } from './listdir'

export const TextView = (props: { name: string }) => {

  const [view, setView]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [edit, setEdit]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [newtext, setNewtext]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(null)
  const [text, setText]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(null)
  const [dropdown, setDropdown]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)
  const [selected, setSelected]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(text_themes.filter((e) => e.id == (localStorage.getItem('text-theme') || "default"))[0].name)
  const [r, reRender]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0)

  const highlight: React.MutableRefObject<boolean> = useRef(localStorage.getItem("highlight") != "no")
  const smthNew: React.MutableRefObject<boolean> = useRef(false)
  const ctrl: React.MutableRefObject<boolean> = useRef(false)
  const lang: React.MutableRefObject<string> = useRef("")

  const { name } = props

  const { path, globals } = useSelector((state: RootState) => state)
  const dispatch = useDispatch()
  const { updateError, updateLevel } = bindActionCreators(ActionCreators, dispatch)

  const handleClick = () => {

    setView(true)

    $.ajax({
      url: globalThis.apiLocation + "view",
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      timeout: 6e4,
      data: JSON.stringify({
        Path: path.substr(1) + '/' + name,
        ...getBaseFtpRequest()
      })
    })
      .done((data: ViewResponse) => {
        if (!data.result) {
          updateError(data.errors[0])
          setView(false)
          return
        }

        updateError('')

        $.ajax({
          url: globalThis.apiLocation + data.url,
          type: 'GET',
          processData: false,
          timeout: 6e4,
          dataType: 'text'
        })
          .done(res => {
            setText(res)
            setNewtext(res)
          })
          .fail(() => { updateLevel("CONNECTING") })


      })
      .fail(() => { updateLevel("CONNECTING") })

  }

  const handleHighlight = () => {
    highlight.current = !highlight.current
    if (globals.consent.states) localStorage.setItem("highlight", highlight.current ? "yes" : "no")
    reRender((p) => p + 1)
  }

  const handleDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    const key: string = e.currentTarget.getAttribute("data-id")
    setSelected(text_themes.filter((e) => e.id == key)[0].name)
    if (globals.consent.states) localStorage.setItem("text-theme", key)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewtext(e.target.value)
  }

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setEdit(true)
  }

  const handleDiscard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setEdit(false)
    setNewtext(text)
  }

  const saveText = () => {
    setLoading(true)
    $.ajax({
      url: globalThis.apiLocation + "textsave",
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      processData: false,
      timeout: 6e4,
      data: JSON.stringify({
        Path: path.substr(1) + '/' + name,
        Text: newtext,
        ...getBaseFtpRequest()
      })
    })
      .done((data: BaseResponse) => {
        if (!data.result) {
          updateError(data.errors[0])
          return
        }
        setEdit(false)
        setText(newtext)
        setLoading(false)
        smthNew.current = true
      })
      .fail(() => { updateLevel("CONNECTING") })
      .always(() => { setLoading(false) })
  }

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    saveText()
  }

  const handleCrtlS = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode == 17) {
      e.preventDefault();
      ctrl.current = true;
    }

    if (e.keyCode == 83 && ctrl.current){
      e.preventDefault();
      if (text == newtext) {
        setEdit(false)
        setNewtext(text)
        return
      }
      saveText()
    }
  }

  useEffect(() => {
    if (highlight.current && !edit) { 
      hljs.highlightAll()
      try {
        lang.current = $(".hold-text code")[0].classList[1].replace("language-", "").replace(/-.+/, "");
      } catch (error) {
        lang.current = ""
      }
    }
  }, [text, r, edit])

  useEffect(() => {
    if (!view && smthNew.current) { listdir() }
  }, [view])

  const text_theme_dropdown: JSX.Element[] = []
  for (const theme of text_themes) {
    text_theme_dropdown.push(
      <div onClick={handleDropdown} data-id={theme.id}>
        <span>{theme.name}</span>
      </div>
    )
  }

  return (
    <div>
      <button type="button" className="button-clear" onClick={handleClick}>View</button>
      {
        !view ? null :
          <div className="overlay">
            <div className="hold-view full">
              <i className="fas fa-times" onClick={() => { setView(false) }} />
              {
                text == null ?
                  <div className="loader" /> :
                  <div className="hold-text">
                    <div className="hold-buttons">
                      <button type="button" className="button-small" onClick={handleHighlight} disabled={edit}>{highlight.current ? "Disable" : "Enable"} highlight</button>
                      <button type="button" className="dropdown button-small" disabled={edit} onClick={() => { setDropdown(!dropdown) }}>
                        {selected}
                        <i className={`fas fa-angle-${dropdown ? "down" : "up"} mt-1`} />
                        <section style={dropdown ? null : { display: "none" }}>{text_theme_dropdown}</section>
                      </button>
                      {
                        !edit ?
                          <button type="button" className="button-small button-highlight ml-auto" onClick={handleEdit}>Edit</button> :
                          loading ? <div className="loader ml-auto mr-5" /> :
                            <div style={{ display: 'flex' }} className="ml-auto">
                              <button type="button" className="button-small" onClick={handleDiscard}>Discard</button>
                              <button type="button" className="button-small button-highlight" disabled={text == newtext} onClick={handleSave}>Save</button>
                            </div>
                      }
                    </div>
                    {
                      edit ?
                      <div id="hold-editor" className={"text-theme-" + text_themes.filter((e) => e.name == selected)[0].id}>
                        <CodeEditor value={newtext} 
                        onChange={handleChange}
                        onKeyDown={handleCrtlS}
                        onKeyUp={() => {ctrl.current = false}}
                        language={lang.current}
                        style={{
                          fontSize: "86%",
                          backgroundColor: "var(--secondary-bg-color)",
                          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }} /> </div>:
                        <pre className={"text-theme-" + text_themes.filter((e) => e.name == selected)[0].id}>
                          <code key={r}>
                            {text}
                          </code></pre>
                    }
                  </div>
              }
            </div>
          </div>
      }
    </div>
  )

}
