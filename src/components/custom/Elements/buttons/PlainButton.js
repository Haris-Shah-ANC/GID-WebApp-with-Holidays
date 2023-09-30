import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function PlainButton(props) {
  const { onButtonClick, title, className, disable, disableStyle } = props
  const tailwindMergedCSS = twMerge(`${disable ? 'bg-gray-400 ' : 'hover:bg-blue-600 bg-blue-500 hover:shadow-lg active:bg-blue-600'} text-sm font-quicksand font-bold py-2.5 px-5  text-white  outline-none focus:outline-none ease-linear transition-all duration-150   rounded shadow`, className)
  return (
    <button
      type="button"
      onClick={onButtonClick}
      className={tailwindMergedCSS}
      disabled={disable}>
      {title}
    </button>
  )
}
