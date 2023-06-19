import React from 'react'

const CustomLabel = (props) => {
    const {label,className=''}=props;
  return (
    <label className={`text-slate-500 ${className}`}>{label}</label>
  )
}

export default CustomLabel