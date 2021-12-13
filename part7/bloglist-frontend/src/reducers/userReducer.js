import loginService from '../services/login'
import storage from '../utils/storage'
import { setNotification } from './notificationReducer'

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'INIT_USER':
    return action.data
  case 'LOGIN_USER':
    return action.data
  case 'LOGOUT_USER':
    return null
  default:
    return state
  }
}

export const login = (credentials) => {
  return async dispatch => {
    try {
      console.log(credentials)
      const user = await loginService.login(credentials)
      storage.saveUser(user)
      dispatch(setNotification(`${credentials.username} welcome back!`, 'success', 5))
      dispatch({
        type: 'LOGIN_USER',
        data: user
      })
    } catch (error) {
      console.log(error)
      dispatch(setNotification('wrong username/password', 'error', 5))
    }

  }
}

export const logout = () => {
  storage.logoutUser()
  return {
    type: 'LOGOUT_USER',
  }
}

export const initializeUser = () => {
  const user = storage.loadUser()
  return {
    type: 'INIT_USER',
    data: user
  }
}

export default reducer
