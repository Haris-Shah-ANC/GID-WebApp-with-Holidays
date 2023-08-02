import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function GidInput(props) {
    const {inputType, id, disable, error, errorStyle, className, value, onTextChange, onBlurEvent, placeholderMsg, reference} = props
    const tailwindMergedCSS = twMerge(`rounded-md border border-blueGray-300 text-sm font-quicksand font-medium text-blueGray-700 placeholder-blueGray-200`, className)
  return (
    <input 
        type={inputType} 
        id={id}
        name={inputType}
        value={value} 
        className={tailwindMergedCSS} 
        onChange={(e) => {onTextChange(e)}} 
        onBlur={() => {onBlurEvent()}} 
        placeholder={placeholderMsg}
        ref={reference}
        >
    </input>
  )
}
