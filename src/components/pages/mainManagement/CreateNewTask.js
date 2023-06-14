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

const CreateNewTask = (props) => {
    const { setShowModal, data } = props;
    const { work_id } = getWorkspaceInfo();

    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);

    const initial_data = {
        work_id: work_id,
        task: data ? data.task : null,
        task_id: data ? data.task_id : null,
        module_id: data ? data.module_id : null,
        dead_line: data ? data.dead_line : null,
        project_id: data ? data.project_id : null,
        status: data ? data.status : 'In-Progress',
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
        <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
            {/* header */}
            <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t text-black">
                <h3 className="text-2xl font-semibold">{formData.task_id ? 'Update Task' : 'Add Task'}</h3>
                <button
                    className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                    onClick={() => setShowModal(false)}
                >
                    <i className="fa-solid fa-times"></i>
                </button>
            </div>
            <form>
                {/* body */}
                <div className="relative p-6 flex-auto">
                    <div className="my-1">
                        <CustomLabel label={`Select  Project`} />
                        <Dropdown disabled={formData.task_id ? true : false} placeholder={true} options={projectsResults} optionLabel={'project_name'} value={selectedProject ? selectedProject : { project_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, project_id: value ? value.project_id : null }))} />
                    </div>
                    {
                        !formData.task_id &&
                        <div className="my-4">
                            <CustomLabel label={`Select Module`} />
                            <Dropdown placeholder={true} options={moduleResults} optionLabel={'module_name'} value={selectedModule ? selectedModule : { module_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, module_id: value ? value.module_id : null }))} />
                        </div>
                    }

                    <div className="my-4">
                        <CustomLabel label={`Description`} />
                        <Input
                            type='textarea'
                            id='description'
                            className="h-20"
                            placeholder="Add the task description"
                            value={formData.task ? formData.task : ''}
                            onChange={(e) => setFormData((previous) => ({ ...previous, task: e.target.value }))}
                        />
                    </div>
                    <div className="my-4 flex justify-between items-center">
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
                    </div>

                    <div className="my-4">
                        <CustomLabel className={`ml-2`} label={<span><i className="fa-solid fa-calendar-days text-base mr-1"></i>Deadline</span>} />
                        <Input
                            id="datetime"
                            name="datetime"
                            type="datetime-local"
                            value={formData.dead_line ? formData.dead_line : ''}
                            onChange={(e) => setFormData((previous) => ({ ...previous, dead_line: e.target.value }))}
                        />
                    </div>

                </div>

                {/* footer */}
                <div className="p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="bg-blue-500 text-white active:bg-blue-600 font-bold text-sm w-full py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                    >
                        Save Changes
                    </button>
                </div>
            </form>


        </div>
    )
}

export default CreateNewTask;
