import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function GIDTextArea(props) {
    const { id, disable, error, errorStyle, className, value, onTextChange, onBlurEvent, placeholderMsg} = props
    const tailwindMergedCSS = twMerge(`rounded-md border border-blueGray-300 text-sm font-quicksand font-medium text-blueGray-700 placeholder-blueGray-200`, className)

  return (
    <textarea
        type={"textarea"} 
        id={id}
        name={"textarea"}
        value={value} 
        className={tailwindMergedCSS} 
        onChange={(e) => {onTextChange(e)}} 
        onBlur={() => {onBlurEvent()}} 
        placeholder={placeholderMsg}
        >
    </textarea>
  )
}
