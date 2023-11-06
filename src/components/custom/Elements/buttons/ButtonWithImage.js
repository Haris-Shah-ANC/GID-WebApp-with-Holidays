import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function ButtonWithImage(props) {
    const {onButtonClick, title, className, disable, disableBtnStyle, iconStyle, disableIconStyle, imageUri,icon} = props
  const tailwindMergedCSS = twMerge(`${disable ? "bg-gray-500" :"bg-[#024a73] hover:bg-[#031e4a] hover:shadow-lg active:bg-[#024a73] focus:outline-none shadow"} flex text-sm font-quicksand font-bold py-2.5 px-5  text-white  outline-none  ease-linear transition-all duration-150  rounded `, className)
  return (
    <button
        type="button"
        disabled={disable}
        onClick={onButtonClick}
        className={tailwindMergedCSS}>
        {icon}
        {title && <span>{title}</span>}
      
    </button>
  )
}