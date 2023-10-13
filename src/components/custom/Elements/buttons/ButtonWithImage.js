import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function ButtonWithImage(props) {
    const {onButtonClick, title, className, disable, disableBtnStyle, iconStyle, disableIconStyle, imageUri,icon} = props
  const tailwindMergedCSS = twMerge(`flex text-sm font-quicksand font-bold py-2.5 px-5 bg-[#024a73] text-white active:bg-[#024a73] outline-none focus:outline-none ease-linear transition-all duration-150 hover:bg-[#031e4a] hover:shadow-lg rounded shadow`, className)
  return (
    <button
        type="button"
        onClick={onButtonClick}
        className={tailwindMergedCSS}>
        {icon}
        {title && <span>{title}</span>}
    </button>
  )
}