import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { DeleteItem } from './delete'
import { Rename } from './rename'
import { ImageView } from './imageview'

const leftOrRight = (x: number) => {
  if (x > window.innerWidth / 2) { return { right: window.innerWidth - x } }
  return { left: x }
}

export const ItemMenu = () => {

  const menu = useSelector((state: RootState) => state.itemmenu)

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
            </div>
        }

      </div>
  )

}
