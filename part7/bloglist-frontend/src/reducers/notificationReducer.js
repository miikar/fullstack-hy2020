let timeoutId

const notificationReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.data
  case 'REMOVE_NOTIFICATION':
    return ''
  default:
    return state
  }
}

export const setNotification = (message, type, timeout) => {
  return async dispatch => {
    clearTimeout(timeoutId)
    dispatch({
      type: 'SET_NOTIFICATION',
      data: { message, type }
    })
    timeoutId = setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION' })
    }, timeout * 1000)
  }
}

export default notificationReducer
