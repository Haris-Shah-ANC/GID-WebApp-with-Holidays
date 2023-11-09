import React from 'react'
import { twMerge } from 'tailwind-merge'

function RadioButton(props) {
    const { title, checked, onChange, disable, className, value } = props
    const labelCSS = twMerge("flex items-center mb-4 font-quicksand font-medium text-sm hover:cursor-pointer", className)
    return (
        <div class={labelCSS}>
            <input disabled={disable} onChange={() => onChange(value)} type="radio" checked={checked == value}></input>
            <label class={`text-sm ml-2 block  ${disable ? "text-gray-500" : "hover:cursor-pointer"}`} onClick={() => {
                if (!disable) {
                    onChange(value)
                }

            }}>{title}</label>
        </div>
    )
}

export default RadioButton
