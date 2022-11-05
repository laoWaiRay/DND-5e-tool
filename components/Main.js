import React from 'react'
import Display from '../components/Display'
import UserInput from './UserInput'

export default function Main({ creatures }) {
  return (
    <>
      <Display />
      <UserInput 
        creatures={creatures}
      />
    </>
  )
}
