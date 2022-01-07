export const itemMenu = (state: itemMenu = null, action: Action<itemMenu | states>): itemMenu => {

  if (action.type == "UPDATE_LEVEL") {
    if (action.payload == "CONNECTING") { return null }
  }

  if (action.type == "UPDATE_ITEMMENU") {

    return (action.payload as itemMenu)

  }

  return state

}
