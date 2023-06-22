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
            navigate: navigate,
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
            {key: "project_id", message: 'Project field left empty'}
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
    <div
    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 md:w-2/4">
            <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Create Module'}</h3>
                    <button
                        className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                        onClick={() => setShowModal(false)}>
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                <form>
                    <div className="relative px-5 pt-2 flex-auto">
                        {projectsResults.length>0 && <div className="my-1 flex flex-col">
                            <CustomLabel label={`Select  Project`} className={'font-quicksand font-semibold text-sm mb-1'}/>
                            <Dropdown disabled={false} placeholder={true} options={projectsResults} optionLabel={'project_name'} value={selectedProject ? selectedProject : { project_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, project_id: value ? value.project_id : null }))} />
                        </div>}
                        

                        <div className="my-4 flex flex-col">
                            <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Module name"} />
                            <Input className="border rounded-sm focus:border-blue-600 focus:border-2" onChange={(e) => setFormData((previous) => ({ ...previous, module_name: e.target.value }))}></Input>
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
                        <button
                            type="button"
                            onClick={() => {createProjectModule()}}
                            className="bg-blue-500 text-white active:bg-blue-600 font-bold text-sm w-full py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                        >
                            Submit
                        </button>
                    </div>
                </form>


            </div>
        </div>
    </div>
  )
}
