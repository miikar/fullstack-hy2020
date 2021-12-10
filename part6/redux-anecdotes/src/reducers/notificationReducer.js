const notificationReducer = (state = 'Initial Notification', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data.message
    case 'REMOVE_NOTIFICATION':
      return ''
    default:
      return state
 }
}

export const setNotification = (message, timeout) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: { message }
    })
    setTimeout(() => {
      dispatch({type: 'REMOVE_NOTIFICATION'})
    }, timeout * 1000)
  }
}

export default notificationReducer
