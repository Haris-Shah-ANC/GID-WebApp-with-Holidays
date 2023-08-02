import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function IconInput(props) {
    const {inputType,id, disable, error, errorStyle, className, value, onTextChange, onBlurEvent, placeholderMsg, icon, isRightIcon, iconStyle} = props
    const tailwindMergedCSS = twMerge(`rounded-md border border-blueGray-300 justify-center items-center relative`, className)
    const tailwindIconCss = twMerge(`w-10 flex justify-center items-center absolute ${isRightIcon ? "right-0 top-0 bottom-0 rounded-tr-md rounded-br-md": "left-0 top-0 bottom-0"}`, iconStyle)
  return (
    <div className={tailwindMergedCSS}>
        <input 
            type={inputType} 
            name={inputType}
            id={id}
            value={value} 
            className={`border-none w-full text-blueGray-700 rounded-md ${(inputType === "datetime-local" || inputType === "time" || inputType === "date") ? "" : "pr-10"} font-quicksand font-medium text-sm`} 
            onChange={(e) => {onTextChange(e)}} 
            onBlur={() => {onBlurEvent()}} 
            placeholder={placeholderMsg}
            >
        </input>
        
        {icon && <div className={tailwindIconCss}>
            <i className={`${icon}`}></i>
            </div>}
    </div>
  )
}
