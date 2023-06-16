import React from 'react';
import moment from 'moment';
import Card from '../../custom/Cards/Card';
import { apiAction } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import * as Actions from '../../../state/Actions';
import Dropdown from '../../custom/Dropdown/Dropdown';
import { DateFormatCard } from '../../../utils/Constant';
import ModelComponent from '../../custom/Model/ModelComponent';

import {
    get_task,
    employee,
    get_all_project,
} from '../../../api/urls';

import {
    getTimeAgo,
    expiredCheck,
} from '../../../utils/Utils';

import {
    getLoginDetails,
    getWorkspaceInfo,
} from '../../../config/cookiesInfo';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);

    const { user_id } = getLoginDetails();
    const { work_id } = getWorkspaceInfo();
    const [tasksResults, setTasksResults] = React.useState([]);
    const [employeeResults, setEmployeeResults] = React.useState([]);
    const [projectsResults, setProjectsResults] = React.useState([]);
    const [filters, setFilters] = React.useState({
        project_id: null,
        employee_id: user_id,
    })

    const getTaskResultsApi = async (id) => {
        let res = await apiAction({
            url: get_task(id),
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
        })
        if (res.success) {
            setTasksResults(res.result)
        }
        // console.log('=====>setTasksResults', res)
    }
    const getEmployeeResultsApi = async (id) => {
        let res = await apiAction({
            url: employee(id),
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
        })
        if (res.success) {
            setEmployeeResults([{ employee_name: 'All Users' }, ...res.results])
        }
    }

    const getProjectsResultsApi = async (id) => {
        let res = await apiAction({
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
            url: get_all_project(id),
        })
        if (res.success) {
            setProjectsResults([{ project_name: 'All Projects' }, ...res.result])
        }
        // console.log('=====>setEmployeeResults', res)
    }

    React.useEffect(() => {
        if (work_id) {
            getTaskResultsApi(work_id);
            getEmployeeResultsApi(work_id);
            getProjectsResultsApi(work_id);
        }
    }, [work_id])

    const getFilteredTask = (data, filter) => {
        return data.filter((item) => {
            if (filter.project_id && filter.employee_id) {
                return item.project_id === filter.project_id && item.employee_id === filter.employee_id;
            }
            if (filter.project_id) {
                return item.project_id === filter.project_id;
            }
            if (filter.employee_id) {
                return item.employee_id === filter.employee_id;
            }
            return true;
        });
    };

    return (
        <React.Fragment>
            <Filter
                filters={filters}
                setFilters={setFilters}
                employeeResults={employeeResults}
                projectsResults={projectsResults}
            />
            <div className=" mt-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredTask(tasksResults, filters).map((item, index) => {
                    return (
                        <div className="h-full w-full" key={index}>
                            <DashboardCard {...item} />
                        </div>
                    )
                })}

            </div>
        </React.Fragment>
    )
}

export default Dashboard;

const Filter = (props) => {
    const { employeeResults, projectsResults, filters, setFilters } = props;

    let selectedUser = employeeResults.find((item) => item.id === filters.employee_id);
    let selectedProject = projectsResults.find((item) => item.project_id === filters.project_id);
    return (
        <nav className="bg-white p-4 mb-4 flex flex-col sm:flex-row items-center gap-4">
            <div className='w-72'>
                <Dropdown options={projectsResults} optionLabel={'project_name'} value={selectedProject ? selectedProject : { project_name: 'All Project' }} setValue={(value) => setFilters((previous) => ({ ...previous, project_id: value ? value.project_id : null }))} />
            </div>
            <div className='w-72'>
                <Dropdown options={employeeResults} optionLabel={'employee_name'} value={selectedUser ? selectedUser : { employee_name: 'All Users' }} setValue={(value) => setFilters((previous) => ({ ...previous, employee_id: value ? value.id : null }))} />
            </div>
        </nav>
    )
}

const DashboardCard = (props) => {
    const { user_id } = getLoginDetails();
    const { assignee, dead_line, employee_name, project_name, employee_id, task, created_at } = props;

    let my_task = user_id === employee_id;

    return (
        <React.Fragment>
            <div className='bg-white flex flex-col p-5 rounded-lg h-full border-borderColor-0 shadow-md'>
                <div className='flex '>
                    <span className="text-xs font-semibold font-quicksand inline-block py-1 px-2 rounded-xl text-lightBlue-600 bg-lightBlue-200 last:mr-0 mr-1">
                    Web design
                    </span>
                </div>
                
                <div className='my-2 h-12 justify-center align-middle font-quicksand font-medium flex flex-col'>
                    <p className='text-5 text-blueGray-800 font-sans line-clamp-2'>{task}</p>
                </div>
                <div className='flex p-2 bg-projectDivBGColor rounded-lg flex-wrap'>
                    <img className='w-8 h-8' src='https://cdn.dribbble.com/users/12666113/avatars/small/3583dee8fd1428a784bd3c31f6ca20d1.png?1659505800' alt=''></img>
                    <div className='flex flex-col ml-3'>
                        <p className='text-5 text-black text-sm font-quicksand font-normal'>{project_name}</p>
                        <a className='text-5 text-black font-quicksand font-light text-xs' href="https://gid.artdexandcognoscis.com/">{"https://gid.artdexandcognoscis.com/"}</a>
                    </div>
                </div>

                <div className="flex flex-wrap mt-4">
                    <div className='mr-auto'>
                        <span className="text-xs font-quicksand font-semibold inline-block py-1 px-2 rounded-full text-blueGray-600 bg-blueGray-200 last:mr-0 mr-1">
                            Assigned By:<i className="fa-solid fa-user mr-1 ml-1"></i>{assignee === employee_name ? "Self" : assignee}
                        </span>
                    </div>

                    <div className='ml-auto'>
                        <span className={`text-xs font-quicksand font-semibold inline-block py-1 px-2 rounded-full font-quicksand ${expiredCheck(dead_line) ? 'text-red-400' : 'text-green-400'} last:mr-0 mr-1`}>
                            <i className="fa-solid fa-clock mr-1"></i> {moment(dead_line).format(DateFormatCard)}
                        </span>
                    </div>

                </div>
                
            </div>
            {/* <Card className={`h-full ${my_task ? 'border-left-success' : 'border-left-blue'}`}>
                <div className='p-3 '>
                    <div className="flex flex-wrap relative">
                        <div className="w-1/2 flex items-center">
                            <i className="fa-solid fa-user text-gray-500 text-lg mr-2"></i>
                            <span className="text-lg font-bold">{employee_name}</span>
                        </div>
                        <div className="w-1/2 text-right items-center">
                            <span className="text-gray-500 ml-auto mt-1 text-sm">{getTimeAgo(created_at)}</span>
                        </div>
                    </div>

                    <div className=" mt-3 mb-4 text-blueGray-500">{task}</div>

                    <div className="mt-auto flex flex-wrap">
                        <div className=''>
                            <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-lightBlue-600 bg-lightBlue-200 last:mr-0 mr-1">
                                {project_name}</span>
                        </div>
                        <div className='ml-auto'>
                            <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-600 bg-blueGray-200 last:mr-0 mr-1">
                                Assigned By:<i className="fa-solid fa-user mr-1 ml-1"></i>{assignee === employee_name ? "Self" : assignee}
                            </span>
                        </div>

                        <div className='ml-auto'>
                            <span className={`text-xs font-semibold inline-block py-1 px-2 rounded-full ${expiredCheck(dead_line) ? 'text-red-400' : 'text-green-400'} last:mr-0 mr-1`}>
                                <i className="fa-solid fa-clock mr-1"></i> {moment(dead_line).format(DateFormatCard)}
                            </span>
                        </div>

                    </div>

                    <StatusComponent {...props} my_task={my_task} />

                </div>
            </Card> */}
        </React.Fragment>

    )
}

const StatusComponent = (props) => {
    const { status, my_task, on_hold_reason } = props
    console.log('=======>props', props)
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedText, setEditedText] = React.useState(on_hold_reason);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveClick = () => {
        // Save the edited text
        // Implement your save functionality here

        setIsEditing(false);
    };
    return (
        <React.Fragment>
            <div className="flex items-center mt-2">
                {status === "On Hold" && (
                    <div className={`rounded-2xl bg-white py-1 px-3.5 text-xs font-bold leading-none`}>
                        <span className={`text-yellow-400`}><i className="fa-solid fa-period"></i>{status}</span>
                    </div>
                )}

                {my_task && (
                    <div
                        onClick={handleEditClick}
                        className="w-10 h-10 ml-auto rounded-full bg-white flex justify-center items-center shadow cursor-pointer"
                    >
                        {isEditing ? (
                            status === "On Hold" ? (
                                <span className="text-yellow-400">
                                    <i className="fa-sharp fa-solid fa-circle-pause"></i>
                                </span>
                            ) : (
                                <span className="text-green-400">
                                    <i className="fa-regular fa-circle-play"></i>
                                </span>
                            )
                        ) : (
                            status === "On Hold" ? (
                                <span className="text-green-400">
                                    <i className="fa-regular fa-circle-play"></i>
                                </span>
                            ) : (
                                <span className="text-yellow-400">
                                    <i className="fa-sharp fa-solid fa-circle-pause"></i>
                                </span>
                            )
                        )}
                    </div>
                )}

            </div>

            {
                isEditing && (
                    <div className="mt-3">
                        <textarea
                            placeholder="Enter the reason for putting the task on hold"
                            value={editedText ? editedText : ''}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="w-full h-20 p-2 border border-gray-300 rounded"
                        />
                        <div className="flex">
                            <button
                                onClick={handleSaveClick}
                                className=" px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
                            >
                                {status === "On Hold" ? 'Change to In Progress' : 'Submit'}
                            </button>
                        </div>
                    </div>

                )
            }
        </React.Fragment >
    )
}
