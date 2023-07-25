import React, { useContext, useState } from 'react'
import Input from '../../custom/Elements/Input'
import CustomLabel from '../../custom/Elements/CustomLabel'
import { isFormValid, notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils'
import { apiAction } from '../../../api/api'
import { useNavigate } from 'react-router-dom'
import * as Actions from '../../../state/Actions';
import { getTheModuleCreationUrl, get_all_project } from '../../../api/urls'
import { getWorkspaceInfo } from '../../../config/cookiesInfo'
import Dropdown from '../../custom/Dropdown/Dropdown'
import PlainButton from '../../custom/Elements/buttons/PlainButton'
import GidInput from '../../custom/Elements/inputs/GidInput'
import ButtonWithImage from '../../custom/Elements/buttons/ButtonWithImage'

export default function AddModule(props) {
    const { work_id } = getWorkspaceInfo();
    const [formData, setFormData] =useState({module_name: '', 
        project_id: null, 
        workspace_id: work_id, 
        deadline: '', 
        deadlineDate: '', 
        deadlineTime: '', 
        date: '', 
        time: ''})
    const {setShowModal} = props
    const dispatch = Actions.getDispatch(useContext);
    const navigate = useNavigate()
    const [projectsResults, setProjectsResults] = React.useState([{ project_name: 'Select project' }]);

    let selectedProject = projectsResults.find((item) => item.project_id === formData.project_id);

    const getProjectsResultsApi = async (id) => {
        let res = await apiAction({
            method: 'get',
            // navigate: navigate,
            dispatch: dispatch,
            url: get_all_project(id),
        })
        if (res.success) {
            setProjectsResults([{ project_name: 'Select project' }, ...res.result])
        }
    }

    React.useEffect(() => {
            getProjectsResultsApi(work_id);

    }, [])

    const createProjectModule = async() => {
        let validation_data = [
            { key: "module_name", message: 'Module field left empty!' },
            { key: "workspace_id", message: 'Workspace left empty!' },
            {key: "project_id", message: 'Project field left empty'},
            {key: "deadline", message: 'Deadline field left empty'}
        ]

        // console.log(JSON.stringify(formData, 0, 2))
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: 'post',
                navigate: navigate,
                dispatch: dispatch,
                url: getTheModuleCreationUrl(),
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
    // <div className="justify-center items-center flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-full mx-2 sm:max-w-sm md:max-w-md overflow-x-auto">
        <div className="relative my-6 md:w-2/4 w-full mx-2 sm:max-w-sm md:max-w-md overflow-x-auto">
            <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Create Module'}</h3>
                    <ButtonWithImage
                        onButtonClick={()=>{setShowModal(false)}} 
                        title={""}
                        className={"rounded-full w-10 h-10 p-0 m-0 justify-center items-center bg-white shadow-none hover:bg-gray-200 active:bg-gray-200"}
                        icon={<i className="fa-solid fa-times text text-black self-center" color='black'></i> }
                        ></ButtonWithImage>
                </div>
                <form>
                    <div className="relative px-5 pt-2 flex-auto">
                        {projectsResults.length>0 && <div className="my-1 flex flex-col">
                            <CustomLabel label={`Select  Project`} className={'font-quicksand font-semibold text-sm mb-1'}/>
                            <Dropdown disabled={false} placeholder={true} options={projectsResults} optionLabel={'project_name'} value={selectedProject ? selectedProject : { project_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, project_id: value ? value.project_id : null }))} />
                        </div>}
                        

                        <div className="my-4 flex flex-col">
                            <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Module name"} />
                            <GidInput 
                                inputType={"text"} 
                                disable={false} 
                                className={""} 
                                value={formData.module_name ? formData.module_name : ''} 
                                onBlurEvent={() => {}}
                                onTextChange={(e) =>{
                                    setFormData((previous) => ({ ...previous, module_name: e.target.value }))
                            }}>

                            </GidInput>
                        </div>

                        <div className="my-4 flex flex-col">
                            <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={<span><i className="fa-solid fa-calendar-days text-base mb-1 mr-1"></i>Deadline</span>} />
                            <Input
                                id="datetime"
                                name="datetime"
                                type="datetime-local"
                                value={formData.deadline ? formData.deadline : ''}
                                onChange={(e) => setFormData((previous) => ({ ...previous, deadline: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="p-6 border-solid border-slate-200 rounded-b">
                        <PlainButton title={"Add Module"} className={"w-full"} onButtonClick={createProjectModule} disable={false}></PlainButton>
                    </div>
                </form>


            </div>
        </div>
    // </div>
  )
}
