import React from 'react';
import moment from 'moment';
import { apiAction } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import Input from '../../custom/Elements/Input';
import * as Actions from '../../../state/Actions';
import Checkbox from '../../custom/Elements/Checkbox';
import Dropdown from '../../custom/Dropdown/Dropdown';
import { routesName } from '../../../config/routesName';
import CustomLabel from '../../custom/Elements/CustomLabel';

import {
    isFormValid,
    formattedDeadline,
    notifyErrorMessage,
    notifySuccessMessage,
} from '../../../utils/Utils';

import {
    getWorkspaceInfo,
} from '../../../config/cookiesInfo';

import {
    post_task,
    update_task,
    get_all_project,
    get_project_module,
} from '../../../api/urls';
import PlainButton from '../../custom/Elements/buttons/PlainButton';

const CreateNewTask = (props) => {
    const { setShowModal, data } = props;
    const { work_id } = getWorkspaceInfo();
    console.log("CREATE NEW TASK", JSON.stringify(data, 0, 2))
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);

    const initial_data = {
        work_id: work_id,
        task: data ? data.task : null,
        task_id: data ? data.task_id : null,
        module_id: data ? data.module_id : null,
        dead_line: data ? data.dead_line : null,
        project_id: data ? data.project_id : null,
        on_hold_reason: data? data.on_hold_reason: null,
        status: data ? data.status : 'In-Progress',
        detailed_description: data ? data.detailed_description : null,
        description_link: data ? data.description_link : null
    }
    const [formData, setFormData] = React.useState({ ...initial_data })

    const [projectsResults, setProjectsResults] = React.useState([{ project_name: 'Select project' }]);
    const [moduleResults, setModuleResults] = React.useState([{ module_name: 'Select module' }]);
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
    const getModuleResultsApi = async (w_id, p_id) => {
        let res = await apiAction({
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
            url: get_project_module(w_id, p_id),
        })
        if (res.success) {
            setModuleResults([{ module_name: 'Select module' }, ...res.project_module_list])
        }
    }
    React.useEffect(() => {
        if (work_id && formData.project_id) {
            getModuleResultsApi(work_id, formData.project_id)
        }
    }, [work_id, formData.project_id])

    React.useEffect(() => {
        if (work_id) {
            getProjectsResultsApi(work_id);
        }

    }, [work_id])

    let selectedProject = projectsResults.find((item) => item.project_id === formData.project_id);
    let selectedModule = moduleResults.find((item) => item.module_id === formData.module_id);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        let validation_data = [
            { key: "project_id", message: 'Please select the project!' },
            { key: "task", message: `Description field left empty!` },
            { key: "dead_line", message: 'Deadline field left empty!' },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: 'post',
                navigate: navigate,
                dispatch: dispatch,
                url:formData.task_id?update_task(): post_task(),
                data: { ...formData, dead_line: formattedDeadline(formData.dead_line) },
            })
            if (res.success) {
                setShowModal(false);
                notifySuccessMessage(res.status);
                if (formData.task_id) {
                navigate(routesName.timeLine.path);
                } else {
                    navigate(routesName.dashboard.path);
                }
            } else {
                notifyErrorMessage(res.detail)
            }
        } else {
            notifyErrorMessage(message)
        }
    };

    return (
        <div className="relative my-6 w-full mx-2 sm:max-w-sm md:max-w-md overflow-y-auto overflow-x-auto">
            <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{formData.task_id ? 'Update Task' : 'Add Task'}</h3>
                    <button
                        className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                        onClick={() => setShowModal(false)}>
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                <form>

                    <div className="relative px-5 pt-2 flex-auto">
                        <div className="my-1 flex flex-col">
                            <CustomLabel label={`Select  Project`} className={'font-quicksand font-semibold text-sm mb-1'}/>
                            <Dropdown disabled={formData.task_id ? true : false} placeholder={true} options={projectsResults} optionLabel={'project_name'} value={selectedProject ? selectedProject : { project_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, project_id: value ? value.project_id : null }))} />
                        </div>
                        {
                            !formData.task_id &&
                            <div className="my-4 flex flex-col">
                                <CustomLabel label={`Select Module`} className={'font-quicksand font-semibold text-sm mb-1'}/>
                                <Dropdown placeholder={true} options={moduleResults} optionLabel={'module_name'} value={selectedModule ? selectedModule : { module_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, module_id: value ? value.module_id : null }))} />
                            </div>
                        }

                        <div className="mt-4 flex flex-col">
                            <CustomLabel label={`Task Description`} className={'font-quicksand font-semibold text-sm mb-1'} />
                            <Input
                                type='textarea'
                                id='description'
                                className="h-20"
                                placeholder="Add the task description"
                                value={formData.task ? formData.task : ''}
                                onChange={(e) => setFormData((previous) => ({ ...previous, task: e.target.value }))}
                            />
                        </div>
                        <div className="mt-2 flex flex-col">
                            <CustomLabel label={`Detailed Description`} className={'font-quicksand font-semibold text-sm mb-1'} />
                            <Input
                                type='textarea'
                                id='description'
                                className="h-20"
                                placeholder="Add the detailed task description"
                                value={formData.detailed_description ? formData.detailed_description : ''}
                                onChange={(e) => setFormData((previous) => ({ ...previous, detailed_description: e.target.value }))}
                            />
                        </div>

                        <div className="mt-2 flex flex-col">
                            <CustomLabel label={`Description Link`} className={'font-quicksand font-semibold text-sm mb-1'} />
                            <Input
                                type='text'
                                id='description'
                                placeholder="Add the link description"
                                value={formData.description_link ? formData.description_link : ''}
                                onChange={(e) => setFormData((previous) => ({ ...previous, description_link: e.target.value }))}
                            />
                        </div>

                        <CustomLabel label={`Status`} className={'font-quicksand font-semibold text-sm mb-1'} />
                        <div className='grid grid-cols-1 space-y-2 md:grid-cols-2 font-quicksand font-semibold text-sm'>
                            <div className="flex items-center cursor-pointer ">
                                <Checkbox
                                    value="In-Progress"
                                    checked={formData.status === 'In-Progress'}
                                    onChange={(e) => setFormData((previous) => ({ ...previous, status: e.target.value }))}
                                />
                                <CustomLabel className={`ml-2`} label={'In Progress'} />
                            </div>
                            <div className="flex items-center cursor-pointer">
                                <Checkbox
                                    value="Pending"
                                    checked={formData.status === 'Pending'}
                                    onChange={(e) => setFormData((previous) => ({ ...previous, status: e.target.value }))}
                                />
                                <CustomLabel className={`ml-2`} label={'Pending'} />
                            </div>

                            {
                                formData.task_id &&
                                <div className="flex items-center cursor-pointer">
                                    <Checkbox
                                        value="Completed"
                                        checked={formData.status === 'Completed'}
                                        onChange={(e) => setFormData((previous) => ({ ...previous, status: e.target.value }))}
                                    />
                                    <CustomLabel className={`ml-2`} label={'Completed'} />
                                </div>
                            }

                            <div className="flex items-center cursor-pointer">
                                <Checkbox
                                    value="On Hold"
                                    checked={formData.status === 'On Hold'}
                                    onChange={(e) => setFormData((previous) => ({ ...previous, status: e.target.value }))}
                                />
                                <CustomLabel className={`ml-2`} label={'On Hold'} />
                            </div>
                        </div>

                        { formData.status === "On Hold" &&
                            <div className="mt-4 flex flex-col">
                                <CustomLabel label={`Reason`} className={'font-quicksand font-semibold text-sm'} />
                                <Input
                                    type='textarea'
                                    id='on_hold_reason'
                                    className="h-20 m-0"
                                    placeholder="Add the task on hold reason"
                                    value={formData.on_hold_reason ? formData.on_hold_reason : ''}
                                    onChange={(e) => setFormData((previous) => ({ ...previous, on_hold_reason: e.target.value }))}
                                />
                        </div>
                        }


                        {/* <div className="mb-4 mt-2 flex justify-between items-center">
                            <div className="flex items-center cursor-pointer">
                                <Checkbox
                                    value="In-Progress"
                                    checked={formData.status === 'In-Progress'}
                                    onChange={(e) => setFormData((previous) => ({ ...previous, status: e.target.value }))}
                                />
                                <CustomLabel className={`ml-2`} label={'In Progress'} />
                            </div>
                            <div className="flex items-center cursor-pointer">
                                <Checkbox
                                    value="Pending"
                                    checked={formData.status === 'Pending'}
                                    onChange={(e) => setFormData((previous) => ({ ...previous, status: e.target.value }))}
                                />
                                <CustomLabel className={`ml-2`} label={'Pending'} />
                            </div>
                            {
                                formData.task_id &&
                                <div className="flex items-center cursor-pointer">
                                    <Checkbox
                                        value="Completed"
                                        checked={formData.status === 'Completed'}
                                        onChange={(e) => setFormData((previous) => ({ ...previous, status: e.target.value }))}
                                    />
                                    <CustomLabel className={`ml-2`} label={'Completed'} />
                                </div>
                            }
                        </div> */}

                        <div className="my-4 flex flex-col">
                            <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={<span><i className="fa-solid fa-calendar-days text-base mb-1 mr-1"></i>Deadline</span>} />
                            <Input
                                id="datetime"
                                name="datetime"
                                type="datetime-local"
                                value={formData.dead_line ? formData.dead_line : ''}
                                onChange={(e) => setFormData((previous) => ({ ...previous, dead_line: e.target.value }))}
                            />
                        </div>

                    </div>

                    
                    <div className="p-6 border-solid border-slate-200 rounded-b">
                        <PlainButton title={"Save Changes"} className={"w-full"} onButtonClick={handleSaveChanges} disable={false}></PlainButton>
                        {/* <button
                            type="button"
                            onClick={handleSaveChanges}
                            className="bg-blue-500 text-white active:bg-blue-600 font-bold text-sm w-full py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                        >
                            Save Changes
                        </button> */}
                    </div>
                </form>


            </div>
        </div>
    )
}

export default CreateNewTask;
