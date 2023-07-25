import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function PlainButton(props) {
    const {onButtonClick, title, className, disable, disableStyle} = props
    const tailwindMergedCSS = twMerge(`text-sm font-quicksand font-bold py-2.5 px-5 bg-blue-500 text-white active:bg-blue-600 outline-none focus:outline-none ease-linear transition-all duration-150 hover:shadow-lg hover:bg-blue-600 rounded shadow`, className)
  return (
    <button
        type="button"
        onClick={onButtonClick}
        className={tailwindMergedCSS}>
        {title}
    </button>
  )
}
