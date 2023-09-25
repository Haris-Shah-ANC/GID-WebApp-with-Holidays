import React, { useEffect, useState } from 'react'
import GidInput from '../../../custom/Elements/inputs/GidInput'
import PlainButton from '../../../custom/Elements/buttons/PlainButton'
import { apiAction } from '../../../../api/api'
import { getTheAddTaskEffortsUrl, getTheListOfTaskEffortsUrl } from '../../../../api/urls'
import { notifyErrorMessage, notifySuccessMessage } from '../../../../utils/Utils'
import { useNavigate } from 'react-router-dom'
import ButtonWithImage from '../../../custom/Elements/buttons/ButtonWithImage'

export default function EffortDatePopup(props) {
  const navigate = useNavigate()
  const { setState, onSuccessCreate, data } = props
  const [effortFormData, setFormData] = useState({ working_date: "", working_duration: "" })



  useEffect(() => {
    getEmployeeTaskEfforts()
    console.log(JSON.stringify(data, 0, 2))
  }, [])

  const addEfforts = () => {
    if (effortFormData.working_date != "" && effortFormData.working_duration != "") {
      addEmployeeTaskEfforts()
    }
  }

  const addEmployeeTaskEfforts = async () => {
    const payload = { workspace_id: data.details.workspace_id, task_id: data.details.id, hour: effortFormData.working_duration, working_date: effortFormData.working_date }
    // console.log(JSON.stringify(payload, 0, 2))
    let res = await apiAction({ url: getTheAddTaskEffortsUrl(), method: 'post', data: payload, navigate: navigate })
    if (res) {
      if (res.success) {
        notifySuccessMessage(res.status);
        onSuccessCreate(res.result, data.index)
        setState(false)
      } else {
        notifyErrorMessage(res.status)
      }
    }
  }

  const getEmployeeTaskEfforts = async () => {
    let res = await apiAction({ url: getTheListOfTaskEffortsUrl(data.details.workspace_id, data.details.id), method: 'get', data: {}, navigate: navigate })
    if (res) {
      // setListOfEfforts(res.result.list_task_record)
    }
  }

  return (
    <>


      <div className="justify-center items-center flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 md:w-2/4 w-full mx-2 sm:max-w-sm md:max-w-md overflow-x-auto">
          <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none p-5">
            {/* header */}
            <div className="flex items-center justify-between border-solid border-slate-200 rounded-t text-black">
              <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Add Efforts'}</h3>
              <ButtonWithImage
                onButtonClick={() => { setState(false) }}
                title={""}
                className={"rounded-full w-10 h-10 p-0 m-0 justify-center items-center bg-white shadow-none hover:bg-gray-200 active:bg-gray-200"}
                icon={<i className="fa-solid fa-times text text-black self-center" color='black'></i>}
              ></ButtonWithImage>
            </div>
            <div className='flex space-x-2 mt-5'>
              <GidInput
                inputType={"date"}
                id={`effort-date`}
                disable={false}
                placeholderMsg={"HH:MM"}
                className={"w-full"}
                value={effortFormData.working_date}
                onBlurEvent={(e) => {}}
                onTextChange={(e) => setFormData((previous) => ({ ...previous, working_date: e.target.value }))}></GidInput>

              <GidInput
                inputType={"number"}
                id='effort-number'
                disable={false}
                placeholderMsg={"HH:MM"}
                className={"w-full"}
                value={effortFormData.working_duration}
                onBlurEvent={(e) => {

                }}
                onTextChange={(e) => {
                  setFormData((previous) => ({...previous, working_duration: e.target.value}))
                }}></GidInput>
            </div>
            <div className='flex gap-3 mt-5'>
              <PlainButton onButtonClick={addEfforts} title={"Add"} className={"w-full border"}></PlainButton>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}