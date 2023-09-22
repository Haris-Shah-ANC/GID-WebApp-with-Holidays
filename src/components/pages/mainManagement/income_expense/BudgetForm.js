import React from 'react'
import Dropdown from '../../../custom/Dropdown/Dropdown'
import GidInput from '../../../custom/Elements/inputs/GidInput'
import { svgIcons } from '../../../../utils/Constant'
import IconInput from '../../../custom/Elements/inputs/IconInput'

export default function BudgetForm(props) {
    const {onFormClose} = props
  return (
    <form className="flex flex-col md:flex-row space-x-2 flex-wrap self-center space-y-2 mt-2 w-full">
        {/* <p className='text-center text-xl'>Budget Details</p>  */}
        <div className='w-full max-w-sm w-lg'>
            <Dropdown options={[]} optionLabel={'project_name'} value={{ name: 'All Project' }} setValue={(value) => {
            
            }} />
        </div>
        <div className='w-full max-w-sm w-lg'>
            <Dropdown options={[]} optionLabel={'employee_name'} value={{ name: 'All Employees' }} setValue={(value) => {
                console.log("ON SELECT", value)
            }} />
        </div>

        <div className='w-full max-w-sm w-lg'>
            <Dropdown options={[]} optionLabel={'employee_name'} value={{ name: 'All Employees' }} setValue={(value) => {
                console.log("ON SELECT", value)
            }} />
        </div>

        {/* <div className="flex max-w-sm space-x-2"> */}
        <GidInput
            inputType={"number"}
            id={`rate-input`}
            disable={false}
            placeholderMsg={"Rate"}
            className={""}
            value={""}
            onBlurEvent={() => { }}
            onTextChange={(e) => {
                console.log("SELECTED DATE", e.target.value)
            }}></GidInput>
        <GidInput
            inputType={"number"}
            id={`exchange-rate-input`}
            disable={false}
            placeholderMsg={"Exchange Rate"}
            className={""}
            value={""}
            onBlurEvent={() => { }}
            onTextChange={(e) => {
                console.log("SELECTED DATE", e.target.value)
            }}></GidInput>
        {/* </div> */}
        {/* <div className="flex max-w-sm space-x-2"> */}
            <IconInput
                id={"task_end_datetime"}
                inputType={"datetime-local"}
                disable={false}
                className={``}
                value={""}
                onTextChange={(e) => ""}
                onBlurEvent={() => { }}
                placeholder={""}
                isRightIcon={true}
            >
            </IconInput>
        {/* </div> */}
        {/* <div className="flex max-w-sm space-x-2"> */}
            <IconInput
                id={"task_end_datetime"}
                inputType={"datetime-local"}
                disable={false}
                className={``}
                value={""}
                onTextChange={(e) => ""}
                onBlurEvent={() => { }}
                placeholder={""}
                isRightIcon={true}
            >
            </IconInput>
        {/* </div> */}
        <button
            type="button"
            className={`text-sm font-quicksand font-bold py-2.5 px-5 bg-blue-500 text-white active:bg-blue-600 outline-none focus:outline-none ease-linear transition-all duration-150 hover:shadow-lg hover:bg-blue-600 rounded shadow`}>
                Add
        </button>
    </form>
  )
}
