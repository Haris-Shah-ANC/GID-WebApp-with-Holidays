import React from 'react'

export default function GIDButton(props) {
    const {onButtonClick, title, btnCss} = props
  return (
    <button className={btnCss} onClick={() => onButtonClick(title)}>
        {title}
    </button>
  )
}
