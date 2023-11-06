import React from 'react'
import { twMerge } from 'tailwind-merge'

function RadioButton(props) {
    const { title, checked, onChange, disable, className } = props
    const labelCSS = twMerge("flex items-center mb-4 font-quicksand font-medium text-sm hover:cursor-pointer", className)
    return (
        <div class={labelCSS}>
            <input disabled={disable} onChange={() => onChange(title)} type="radio" checked={checked == title}></input>
            <label class="text-sm ml-2 block hover:cursor-pointer" onClick={() => onChange(title)}>{title}</label>
        </div>
    )
}

export default RadioButton
