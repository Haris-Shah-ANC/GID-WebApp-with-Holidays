import React from 'react'
import GidInput from '../../../custom/Elements/inputs/GidInput'
import PlainButton from '../../../custom/Elements/buttons/PlainButton'

export default function EffortDatePopup(props) {
  const {onClose, onAdd} = props
  return (
    <div className='flex flex-col mt-44 absolute bg-white shadow p-2 space-y-3'>
      <p className='text-sm font-quicksand font-bold text-center'>Add Efforts</p>
      <div className='flex w-64 space-x-2'>
        <GidInput
            inputType={"date"}
            id={`effort-date`}
            disable={false}
            placeholderMsg={"HH:MM"}
            className={"h-8 w-40"}
            value={""}
            onBlurEvent={() => { }}
            onTextChange={(e) => {
            }}></GidInput>

        <GidInput
          inputType={"number"}
          id='effort-number'
          disable={false}
          placeholderMsg={"HH:MM"}
          className={"h-8 w-24"}
          value={""}
          onBlurEvent={(e) => {

          }}
          onTextChange={(e) => {
              
          }}></GidInput>
      </div>
      <div className='flex gap-3'>
      <PlainButton onButtonClick={onClose()} title={"Close"} className={"py-1 w-full bg-white text-black hover:bg-white border"}></PlainButton>
      <PlainButton onButtonClick={onAdd()} title={"Add"} className={"py-1 w-full border"}></PlainButton>
      </div>
    </div>
  )
}
