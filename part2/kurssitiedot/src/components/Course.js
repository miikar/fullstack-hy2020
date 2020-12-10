import React from 'react';

const Header = ({ name }) => {
  return (
    <h1>{name}</h1>
    )
}
  
const Total = ({ total }) => {
  return(
    <strong>Number of exercises {total}</strong>
    ) 
}
    
const Part = ({ part }) => {

  return (
    <p>
      {part.name} {part.exercises}
    </p>    
    )
}
      
const Content = ({ parts }) => {
  const total = parts.reduce((acc, cur) => acc + cur.exercises, 0);
  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part}/>
      )}
      <Total total={total}/>
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
    </div>
  )
}

export default Course;