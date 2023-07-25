import React, { useContext, useState } from 'react'
import Input from '../../custom/Elements/Input'
import CustomLabel from '../../custom/Elements/CustomLabel'
import { isFormValid, notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils'
import { apiAction } from '../../../api/api'
import { useNavigate } from 'react-router-dom'
import * as Actions from '../../../state/Actions';
import { getCreateProjectUrl } from '../../../api/urls'
import { getWorkspaceInfo } from '../../../config/cookiesInfo'
import GidInput from '../../custom/Elements/inputs/GidInput'

export default function AddProject(props) {
    const { work_id } = getWorkspaceInfo();
    const [formData, setFormData] =useState({workspace_id: work_id, project_name: "", project_tag: ""})
    const {setShowModal} = props
    const dispatch = Actions.getDispatch(useContext);
    const navigate = useNavigate()

    const createProject = async() => {
        let validation_data = [
            { key: "project_name", message: 'Project field left empty!' },
            { key: "workspace_id", message: 'Workspace left empty!' },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: 'post',
                // navigate: navigate,
                dispatch: dispatch,
                url: getCreateProjectUrl(),
                data: formData,
            })
            if (res.success) {
                setShowModal(false);
                notifySuccessMessage(res.status);
            } else {
                notifyErrorMessage(res.detail)
            }
        } else {
            notifyErrorMessage(message)
        }
    }

    
  return (
    <div className="relative my-6 md:w-2/4 w-full mx-2 sm:max-w-sm md:max-w-md overflow-x-auto">
            <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Create Project'}</h3>
                    <button
                        className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                        onClick={() => setShowModal(false)}>
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                <form>

                    <div className="relative px-5 pt-2 flex-auto">
                        <div className="my-4 flex flex-col">
                            <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Project Name"} />
                            <GidInput 
                                inputType={"text"} 
                                disable={false} 
                                className={""} 
                                value={formData.project_name ? formData.project_name : ''} 
                                onBlurEvent={() => {}}
                                onTextChange={(e) =>{
                                    setFormData((previous) => ({...previous, project_name: e.target.value}))
                            }}>

                            </GidInput>
                        </div>
                        

                        <div className="my-4 flex flex-col">
                            <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Project Description"} />
                                <GidInput 
                                    inputType={"text"} 
                                    disable={false} 
                                    className={""} 
                                    value={formData.project_tag ? formData.project_tag : ""} 
                                    onBlurEvent={() => {}}
                                    onTextChange={(e) =>{
                                        setFormData((previous) => ({...previous, project_tag: e.target.value}))
                                }}>

                                </GidInput>
                        </div>

                    </div>

                    
                    <div className="p-6 border-solid border-slate-200 rounded-b">
                        <button
                            type="button"
                            onClick={() => {createProject()}}
                            className="bg-blue-500 text-white active:bg-blue-600 font-bold text-sm w-full py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                        >
                            Submit
                        </button>
                    </div>
                </form>


            </div>
        </div>
  )
}
