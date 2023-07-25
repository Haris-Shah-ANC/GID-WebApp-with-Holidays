import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function LabeledInput(props) {
    const {inputType, disable, error, errorStyle, className, value, onTextChange, onBlurEvent, placeholderMsg, rightIcon} = props
    const tailwindMergedCSS = twMerge(`rounded-md border border-blueGray-300`, className)
  return (
    <div className='flex flex-col'>
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
        <i className={rightIcon}></i>
    </div>
  )
}
