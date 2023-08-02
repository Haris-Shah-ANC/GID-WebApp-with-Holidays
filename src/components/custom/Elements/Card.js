import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function Card(props) {
    const {component, className} = props
    const twCSS = twMerge("relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded-md", className)
  return (
    <div className={twCSS}>
        {component}
    </div>
  )
}
