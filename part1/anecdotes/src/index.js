import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ text, onClick }) => {
  return(
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(props.anecdotes.length).fill(0))
  const [indexOfBest, setIndexOfBest] = useState(0)

  const nextAnecdote = () => {
    const random = Math.floor(Math.random() * props.anecdotes.length)
    setSelected(random)
  }

  const voteAnecdote = () => {
    const copy = [...points]
    copy[selected] += 1
    // update index of most voted anecdote
    if (copy[selected] > points[indexOfBest]) setIndexOfBest(selected)
    setPoints(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>
        {props.anecdotes[selected]} <br/> has {points[selected]} votes
      </p>
      <Button text={'vote'} onClick={voteAnecdote} />
      <Button text={'next anecdote'} onClick={nextAnecdote} />
      <h1>Anecdote with most votes</h1>
      <p>
        {props.anecdotes[indexOfBest]} <br/> has {points[indexOfBest]} votes
      </p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)