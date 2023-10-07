import React, { useContext, useState } from 'react'
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
import IconInput from '../../custom/Elements/inputs/IconInput'

export default function AddModule(props) {
    const { work_id } = getWorkspaceInfo();
    const [formData, setFormData] = useState({
        module_name: '',
        project_id: null,
        workspace_id: work_id,
        deadline: '',
        deadlineDate: '',
        deadlineTime: '',
        date: '',
        time: ''
    })
    const { setShowModal } = props
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

    const createProjectModule = async () => {
        let validation_data = [
            { key: "module_name", message: 'Module field left empty!' },
            { key: "workspace_id", message: 'Workspace left empty!' },
            { key: "project_id", message: 'Project field left empty' },
            { key: "deadline", message: 'Deadline field left empty' }
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

        <div>
            <form>
                <div className="relative px-5 pt-2 flex-auto">
                    {projectsResults.length > 0 && <div className="my-1 flex flex-col">
                        <CustomLabel label={`Select  Project`} className={'font-quicksand font-semibold text-sm mb-1'} />
                        <Dropdown disabled={false} placeholder={true} options={projectsResults} optionLabel={'project_name'} value={selectedProject ? selectedProject : { project_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, project_id: value ? value.project_id : null }))} />
                    </div>}


                    <div className="my-4 flex flex-col">
                        <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Module name"} />
                        <GidInput
                            inputType={"text"}
                            disable={false}
                            placeholderMsg={"Enter module name"}
                            className={""}
                            value={formData.module_name ? formData.module_name : ''}
                            onBlurEvent={() => { }}
                            onTextChange={(e) => {
                                setFormData((previous) => ({ ...previous, module_name: e.target.value }))
                            }}>

                        </GidInput>
                    </div>

                    <div className="my-4 flex flex-col">
                        <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={<span><i className="fa-solid fa-calendar-days text-base mb-1 mr-1"></i>Deadline</span>} />
                        <IconInput
                            id={"task_end_datetime"}
                            inputType={"datetime-local"}
                            disable={false}
                            className={``}
                            value={formData.deadline ? formData.deadline : ""}
                            onTextChange={(e) => setFormData((previous) => ({ ...previous, deadline: e.target.value }))}
                            onBlurEvent={() => { }}
                            placeholder={""}
                            isRightIcon={true}
                        >
                        </IconInput>
                    </div>

                </div>

                <div className="p-6 border-solid border-slate-200 rounded-b">
                    <PlainButton title={"Add Module"} className={"w-full"} onButtonClick={createProjectModule} disable={false}></PlainButton>
                </div>
            </form>
        </div>
    )
}
