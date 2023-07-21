import React from 'react'

export default function Button(props) {
    const {onButtonClick, title, className} = props
  return (
    <button
        type="button"
        onClick={onButtonClick}
        className={className}>
        {title}
    </button>
  )
}
