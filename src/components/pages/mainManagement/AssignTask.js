import React from 'react';
import moment from 'moment';
import Card from '../../custom/Cards/Card';
import { apiAction } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import * as Actions from '../../../state/Actions';
import Dropdown from '../../custom/Dropdown/Dropdown';
import { routesName } from '../../../config/routesName';
import CustomLabel from '../../custom/Elements/CustomLabel';
import { DateFormatCard, add_task } from '../../../utils/Constant';

import {
    employee,
    assign_task,
    get_all_project,
    get_assigned_task,
    get_project_module,
} from '../../../api/urls';

import {
    getTimeAgo,
    isFormValid,
    task_status_color,
    formattedDeadline,
    notifyErrorMessage,
    notifySuccessMessage,
} from '../../../utils/Utils';

import {
    getLoginDetails,
    getWorkspaceInfo,
} from '../../../config/cookiesInfo';
import Input from '../../custom/Elements/Input';


const AssignTask = () => {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);

    const { user_id } = getLoginDetails();
    const { work_id } = getWorkspaceInfo();

    const [assignedTaskResults, setAssignedTaskResults] = React.useState([]);
    const getEmployeeResultsApi = async (id) => {
        let res = await apiAction({
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
            url: get_assigned_task(id),
        })
        if (res) {
            const filter_result = res.result.filter((item) => item.employee_id !== user_id)
            setAssignedTaskResults(filter_result)
        }
    }


    React.useEffect(() => {
        if (work_id) {
            getEmployeeResultsApi(work_id);
        }
    }, [work_id])

    const headers = [
        { fields: 'Sr. No' },
        { fields: 'Employee' },
        { fields: 'Project' },
        { fields: 'Task' },
        { fields: 'Status' },
        { fields: 'Deadline' },
        { fields: 'Created' },
    ]
    return (
        <div>
            <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-3'>
                <div class="items-center p-10 flex justify-center">
                    <img className='w-3/4 self-center' src="https://gid.artdexandcognoscis.com/static/img/undraw_add_tasks_re_s5yj.svg" alt=""></img>
                </div>
                <div>
                    <AssignedTask />
                </div>
            </div>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded-lg bg-white text-blueGray-700">
                <CustomTable headers={headers} columns={assignedTaskResults} />
            </div>
        </div>
    )
}

export default AssignTask;

const CustomTable = (props) => {
    const { headers = [], columns = [] } = props;

    const [searchTerm, setSearchTerm] = React.useState('')
    const getFilteredTask = (data, searchTerm) => {
        if (searchTerm.trim() === "") {
            return data;
        }
        return data.filter((item) => {
            return item.employee_name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };
    return (
        <>
            <div className="px-6 py-4 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="w-full md:w-1/2 items-center">
                        <h3 className="text-lg text-blueGray-700 font-quicksand font-bold">Assigned Tasks</h3>
                    </div>
                    <div className="w-full md:w-1/2 text-right items-center justify-end">
                        <div className="w-full md:w-72">
                            <Input
                                type="text"
                                id="employee_name"
                                name="employee_name"
                                value={searchTerm}
                                placeholder="Enter Employee Name"
                                rightIcon={'fa-solid fa-magnifying-glass'}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                        <tr>
                            {headers.map((item, index) => {
                                return (
                                    <th
                                        key={index}
                                        className="px-6 py-3 text-xs text-left bg-blueGray-100 text-blueGray-500 border-blueGray-200 rounded-sm font-quicksand font-semibold "
                                    >
                                        {item.fields}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {getFilteredTask(columns, searchTerm).map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-base">{index + 1}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-base">{item.employee_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-base">{item.project_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-base">{item.task}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={task_status_color(item.status)}>
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-base">
                                            {moment(item.dead_line).format(DateFormatCard)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-base">{getTimeAgo(item.created_at)}</div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>


    )
}


const AssignedTask = () => {
    const { work_id } = getWorkspaceInfo();
    const { user_id } = getLoginDetails();


    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);

    const initial_data = {
        workspace_id: work_id,
        employee_id: null,
        task: null,
        module_id: null,
        dead_line: null,
        project_id: null,
        status: 'Pending',
    }
    const [formData, setFormData] = React.useState({ ...initial_data })

    const [employeeResults, setEmployeeResults] = React.useState([{ employee_name: 'Select Employee' }]);
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
    const getEmployeeResultsApi = async (id) => {
        let res = await apiAction({
            url: employee(id),
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
        })
        if (res.success) {
            let filterResults = res.results.filter((item) => item.id !== user_id)
            setEmployeeResults([{ employee_name: 'Select Employee' }, ...filterResults])
        }
    }
    React.useEffect(() => {
        if (work_id && formData.project_id) {
            getModuleResultsApi(work_id, formData.project_id)
        }
    }, [work_id, formData.project_id])

    React.useEffect(() => {
        if (work_id) {
            getEmployeeResultsApi(work_id);
            getProjectsResultsApi(work_id);
        }

    }, [work_id])

    let selectedProject = projectsResults.find((item) => item.project_id === formData.project_id);
    let selectedModule = moduleResults.find((item) => item.module_id === formData.module_id);
    let selectedUser = employeeResults.find((item) => item.id === formData.employee_id);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        let validation_data = [
            { key: "employee_id", message: 'Please select the employee!' },
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
                url: assign_task(),
                data: { ...formData, dead_line: formattedDeadline(formData.dead_line) },
            })
            if (res.success) {
                notifySuccessMessage(res.status);
                navigate(routesName.assignTask.path);
            } else {
                notifyErrorMessage(res.detail)
            }
        } else {
            notifyErrorMessage(message)
        }
    };
    return (
        <div className="w-full mb-10 border-0 rounded-xl shadow-lg flex flex-col bg-white outline-none focus:outline-none">
            {/* header */}
            <form className="p-6 pt-0">
                <div className="text-center items-center p-5 border-b border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-2xl font-quicksand font-bold">{'Assign Task'}</h3>
                </div>

                {/* body */}
                <div className="relative p-6 flex-auto font-quicksand font-medium text-sm">
                    <div className="my-1 flex flex-col">
                        <CustomLabel label={`Select Employee`} className={'py-1'} />
                        <Dropdown options={employeeResults} optionLabel="employee_name" value={selectedUser ? selectedUser : { employee_name: 'All Users' }} setValue={(value) => setFormData((previous) => ({ ...previous, employee_id: value ? value.id : null }))} />
                    </div>

                    <div className="my-3 flex flex-col">
                        <CustomLabel label={`Select Project`} className={'py-1'}/>
                        <Dropdown placeholder={true} options={projectsResults} optionLabel="project_name" value={selectedProject ? selectedProject : { project_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, project_id: value ? value.project_id : null }))} />
                    </div>

                    {!formData.task_id && (
                        <div className="my-3 flex flex-col">
                            <CustomLabel label={`Select Module`} className={'py-1'}/>
                            <Dropdown placeholder={true} options={moduleResults} optionLabel="module_name" value={selectedModule ? selectedModule : { module_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, module_id: value ? value.module_id : null }))} />
                        </div>
                    )}

                    <div className="my-3 flex flex-col">
                        <CustomLabel label={`Description`} className={'py-1'}/>
                        <Input
                            type="textarea"
                            id="description"
                            className="h-20 font-quicksand font-medium"
                            placeholder="Add the task description"
                            value={formData.task ? formData.task : ''}
                            onChange={(e) => setFormData((previous) => ({ ...previous, task: e.target.value }))}
                        />
                    </div>

                    <div className="my-3 flex flex-col">
                        <CustomLabel className={`ml-0 py-1`} label={<span><i className="fa-solid fa-calendar-days text-base mr-1"></i>Deadline</span>} />
                        <Input
                            id="datetime"
                            name="datetime"
                            className={'font-quicksand font-medium'}
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
                        className="font-quicksand font-bold bg-blue-500 text-white active:bg-blue-600 text-sm w-full py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                    >
                        Assign
                    </button>
                </div>
            </form>
        </div>
    )
}