import React from 'react'
import { twMerge } from 'tailwind-merge';

const CustomLabel = (props) => {
  const { label, className } = props;
  const labelCSS = twMerge("text-slate-500 font-quicksand text-sm font-semibold", className)
  return (
    <label className={labelCSS}>{label}</label>
  )
}

export default CustomLabel