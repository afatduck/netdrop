export const itemMenu = (state: itemMenu = null, action: Action<itemMenu>): itemMenu => {

  if (action.type == "UPDATE_ITEMMENU") {

    return action.payload

  }

  return state

}
