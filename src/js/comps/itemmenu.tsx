import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import { DeleteItem } from './delete'
import { Rename } from './rename'
import { ImageView } from './imageview'
import { TextView } from './textview'

import { downloadItem } from './download'
import * as ActionCreators from '../actions'

const leftOrRight = (x: number) => {
  if (x > window.innerWidth / 2) { return { right: window.innerWidth - x } }
  return { left: x }
}

export const ItemMenu = () => {

  const menu = useSelector((state: RootState) => state.itemmenu)
  const path = useSelector((state: RootState) => state.path)

  const dispatch = useDispatch()
  const { updateMovePath, updateItemMenu } = bindActionCreators(ActionCreators, dispatch)

  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false)

  return (
    !menu ? null :
      <div id="item-menu"
        style={{
          top: menu.y,
          ...leftOrRight(menu.x)
        }}>
        <h5>{menu.item.name}</h5>

        {
          loading ? <div className="loader mb-4 ml-auto mr-auto" /> :
            <div>
              <DeleteItem name={menu.item.name} setLoading={setLoading} />
              <Rename name={menu.item.name} setLoading={setLoading} />
              {parseInt(menu.item.size) <= 4194304 && menu.item.mime.includes("image") ? <ImageView name={menu.item.name} /> : null}
              {
                menu.item.type == "file" && parseInt(menu.item.size) <= 524288 &&
                  (menu.item.mime.includes("text") || menu.item.mime.includes("application"))
                  ? <TextView name={menu.item.name} /> : null}
              <button type="button" className="button-clear" name="download" onClick={() => { downloadItem(menu.item.name, menu.item.type == "dir") }} >Download</button>
              <button type="button" className="button-clear" name="move" onClick={() => {
                updateMovePath(`${path}/${menu.item.name}`)
                updateItemMenu(null)
              }}>Cut</button>
            </div>
        }

      </div>
  )

}
