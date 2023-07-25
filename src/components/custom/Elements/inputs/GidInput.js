import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function GidInput(props) {
    const {inputType, disable, error, errorStyle, className, value, onTextChange, onBlurEvent, placeholderMsg} = props
    const tailwindMergedCSS = twMerge(`rounded-md border border-blueGray-300 text-sm font-quicksand font-medium text-blueGray-700`, className)
  return (
    <input 
        type={inputType} 
        name={inputType}
        value={value} 
        className={tailwindMergedCSS} 
        onChange={(e) => {onTextChange(e)}} 
        onBlur={() => {onBlurEvent()}} 
        placeholder={placeholderMsg}
        >
    </input>
  )
}
