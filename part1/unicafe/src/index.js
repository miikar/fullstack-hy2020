import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Button = ({ text, onClick }) => {
  return(
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({ text, value }) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const { good, neutral, bad, all, average , positive} = props
  if ((good + neutral + bad) === 0) {
    return(
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  return(
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text={'good'} value={good} />
          <StatisticLine text={'neutral'} value={neutral} />
          <StatisticLine text={'bad'} value={bad} />
          <StatisticLine text={'all'} value={all} />
          <StatisticLine text={'average'} value={average} />
          <StatisticLine text={'positive'} value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const Feedback = (props) => {
  return(
    <div>
      <h1>give feedback</h1>
      <Button text={'good'} onClick={props.handleGood}/>
      <Button text={'neutral'} onClick={props.handleNeutral}/>
      <Button text={'bad'} onClick={props.handleBad}/>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState('0 %')

  const handleGood = () => {
    const a = all + 1
    const g = good + 1
    const p = (g / a) * 100 + ' %'
    setAll(a)
    setGood(g)
    setAverage((g - bad) / a)
    setPositive(p)
  }

  const handleNeutral = () => {
    const a = all + 1
    const n = neutral + 1
    const p = (good / a) * 100 + ' %'
    setAll(a)
    setNeutral(n)
    setAverage((good - bad) / a)
    setPositive(p)
  }

  const handleBad = () => {
    const a = all + 1
    const b = bad + 1
    const p = (good / a) * 100 + ' %'
    setAll(a)
    setBad(b)
    setAverage((good - b) / a)
    setPositive(p)
  }

  return (
    <div>
      <Feedback 
        handleGood={handleGood}
        handleNeutral={handleNeutral}
        handleBad={handleBad}/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)