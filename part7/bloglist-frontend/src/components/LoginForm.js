import React from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'

const LoginForm = () => {
  const dispatch = useDispatch()

  const handleLogin = (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    dispatch(login({ username, password }))
    event.target.username.value = ''
    event.target.password.value = ''
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            name='username'
            id='username'
          />
        </div>
        <div>
          password
          <input
            name='password'
            id='password'
          />
        </div>
        <button id='login'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
