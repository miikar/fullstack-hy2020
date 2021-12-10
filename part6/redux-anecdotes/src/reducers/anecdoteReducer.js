import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  switch(action.type) {
    case 'VOTE':
      const changedAnecdote = action.data
      return state.map(anecdote =>
        anecdote.id !== changedAnecdote.id ? anecdote : changedAnecdote
      )
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,      
    })
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const vote = (existingAnecdote) => {
  return async dispatch => {
    const changedAnecdote = { ...existingAnecdote, votes: existingAnecdote.votes + 1 }
    const returnedAnecdote = await anecdoteService.update(changedAnecdote.id, changedAnecdote)
    dispatch({
      type: 'VOTE',
      data: returnedAnecdote
    })
  }
}

export default anecdoteReducer
