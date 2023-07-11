import React from 'react'

export default function Card(props) {
    const {component} = props
  return (
    <div className='rounded-md'>
        {component}
    </div>
  )
}
