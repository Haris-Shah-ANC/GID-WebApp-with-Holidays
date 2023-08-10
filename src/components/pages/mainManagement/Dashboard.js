import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import Card from '../../custom/Cards/Card';
import { apiAction } from '../../../api/api';
import { json, useNavigate } from 'react-router-dom';
import * as Actions from '../../../state/Actions';
import Dropdown from '../../custom/Dropdown/Dropdown';
import { DateFormatCard, add_task, create_new_work_space, filter_and_sort, imagesList } from '../../../utils/Constant';
import ModelComponent from '../../custom/Model/ModelComponent';
import {isFormValid, notifyErrorMessage, notifySuccessMessage, formattedDeadline} from '../../../utils/Utils'

import {
    get_task,
    employee,
    get_all_project,
    getTaskListUrl,
    update_task,
} from '../../../api/urls';

import {
    getTimeAgo,
    expiredCheck,
} from '../../../utils/Utils';

import {
    getLoginDetails,
    getWorkspaceInfo,
} from '../../../config/cookiesInfo';
import classNames from 'classnames';
import PopUpMenu from '../../custom/popups/PopUpMenu';
import Checkbox from '../../custom/Elements/buttons/Checkbox';
import CustomLabel from '../../custom/Elements/CustomLabel';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);

    const { user_id } = getLoginDetails();
    const state = Actions.getState(useContext)
    const {work_id}  = getWorkspaceInfo();
    const [tasksResults, setTasksResults] = useState([]);
    const [taskCategoryIndex, setTaskCategoryIndex] = useState(0)
    const [listOfEmployees, setEmployees] = useState([])
    const [selectedUser, selectUser] = useState(null)
    const [btnLabelList, setTaskCount] = useState([
        { index: 0, title: "In Progress", count: 0 }, 
        { index: 1, title: "Pending", count: 0 }, 
        { index: 2, title: "Completed", count: 0 }, 
        { index: 3, title: "All", count: 0 }, 
    ])
    const [postBody, setPostBody] = useState({ "workspace_id": work_id, projects: [], "tasks": ["In-Progress", "On Hold"], "employees": [user_id] })
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});

    const [filters, setFilters] = useState({
        employee_id: null,
        module_id: null,
        project_id: null,
    })


    useEffect(() => {
        let URL = get_task() + `?created_at__date__gte=&created_at__date__lte=&workspace=${work_id}&project__in=${postBody.projects.join(",")}&employee__in=${taskCategoryIndex === 3 ? "" : postBody.employees.join(",")}&status__in=${postBody.tasks.join(",")}`
        getTaskList(URL)
    }, [postBody, state.workspace])

    useEffect(() => {
        getEmployeeResultsApi()
    }, [])
    

    const getTaskList = async (URL) => {
        let res = await apiAction({ url: URL, method: 'get', navigate: navigate, dispatch: dispatch })
        if (res.success) {
            setTasksResults(res.results)
            btnLabelList[taskCategoryIndex].count = res.results.length
            setTaskCount([...btnLabelList])
        }
    }

    // const getAllTaskList = async () => {
    //     let res = await apiAction({ url: get_task(work_id), method: 'get', navigate: navigate, dispatch: dispatch })
    //     if (res.success) {
    //         setTasksResults(res.result)
    //         btnLabelList[taskCategoryIndex].count = res.result.length
    //         setTaskCount([...btnLabelList])
    //     }
    // }

    const getEmployeeResultsApi = async () => {
        let res = await apiAction({
            url: employee(work_id),
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
        })
        if (res.success) {
            selectUser(res.results.find((item, index) => item.id === user_id))
            setEmployees([{ employee_name: 'Select Employee' }, ...res.results])
        }
    }

    const onCategoryBtnClick = (index) => {
        if (index === 0 || index ===3) {
            setPostBody({ ...postBody, tasks: ["In-Progress", "On Hold"] })
        } else if (index === 1) {
            setPostBody({ ...postBody, tasks: ["Pending"] })
        } else if (index === 2) {
            setPostBody({ ...postBody, tasks: ["Completed"] })
        }
        setTaskCategoryIndex(index)
    }

    const getBtnStyle = (index) => {
        if (index === taskCategoryIndex) {
            return "border-b-4 border-[#2e53e2] rounded"
        }
        return ""
    }

    const onTaskComplete = () => {
        // getTaskList()
    }

    const onTaskEditClick = (item) => {
        setFormData({
            task: item.task,
            module_id: null,
            work_id: work_id,
            status: item.status,
            task_id: item.task_id,
            project_id: item.project_id,
            on_hold_reason: item.on_hold_reason,
            dead_line: moment(item.dead_line).format("YYYY-MM-DD HH:mm"),
        });
        setShowModal(add_task)
    }

    const onNewTaskAddClick = (item) => {
        // setFormData();
        setShowModal(add_task)
    }

    const onFilterApply = (data) => {

        setFilters(data)
        let pBody = { ...postBody, workspace_id: work_id }
        if (data.employee_id) {
            pBody["employees"] = [data.employee_id]
        } else {
            pBody["employees"] = []
        }
        if (data.module_id) {
            // pBody["module_id"] = [data.module_id]
        } else {
            // pBody["module_id"] = [data.module_id]
        }
        if (data.project_id) {
            pBody["projects"] = [data.project_id]
        } else {
            pBody["projects"] = []
        }
        
        if (postBody !== {}) {
            setPostBody(pBody)
        }
    }
    const onFilterClear = () => {
        setFilters({
            employee_id: null,
            module_id: null,
            project_id: null,
        })
        setPostBody({ tasks: [btnLabelList[taskCategoryIndex].title], projects: [], workspace_id: work_id, employees: [] })
    }

    const onFilterClick = () => {
        setFormData(filters);
        setShowModal(filter_and_sort)
    }

    return (
        <React.Fragment>
            <ModelComponent showModal={showModal} setShowModal={setShowModal} data={formData} onFilterApply={onFilterApply} onFilterClear={onFilterClear} />
            {/* <Filter
                filters={filters}
                setFilters={setFilters}
                employeeResults={employeeResults}
                projectsResults={projectsResults}
            /> */}

            <div className="bg-white rounded-xl flex flex-col md:flex-row justify-between shadow">
                <div className='flex-row flex w-1/2 pt-8'>
                    {btnLabelList.map((item, index) => {
                        return (
                            <div className={`flex flex-row px-0.5 mx-5 pb-3 items-center ${getBtnStyle(index)}`} >
                                <button className={classNames("flex font-quicksand font-bold flex-row items-center text-sm hover:opacity-75  outline-none focus:outline-none", {
                                    "text-[#b7c1cc]": index!==taskCategoryIndex,
                                    "text-[#2e53e2]":index===taskCategoryIndex})} onClick={() => onCategoryBtnClick(index)}>
                                    {item.title}
                                </button>
                                <p className={classNames("px-1 text-xs mx-2 text-white rounded", {
                                    "bg-[#2e53e2]": index === taskCategoryIndex,
                                    "bg-[#b7c1cc]": index !== taskCategoryIndex
                                })}>{item.count}</p>
                            </div>
                        )
                    })}

                </div>
                <div className='flex flex-col md:flex-row ml-2 space-x-0 space-y-3 items-start md:space-x-3 md:space-y-0 md:items-center mr-5 w-1/2 justify-end'>
                        <div className='max-w-sm w-full'>
                            <Dropdown options={listOfEmployees} optionLabel="employee_name" value={selectedUser ? selectedUser : { employee_name: 'All Users' }} setValue={(value) => {
                                selectUser(value)
                                setTasksResults([])
                                setPostBody({...postBody, employees: [value.id]})
                                }} />
                        </div>

                        <button className='border border-[#dddddf] rounded-lg flex px-3 py-2' onClick={onFilterClick}>
                            <i className="fa-solid fa-sliders mr-2 text-[#75787b]"></i>
                            <p className='text-[#75787b] font-semibold font-quicksand text-sm'>Filter</p>
                        </button>

                        <button className='border border-[#dddddf] rounded-lg flex px-3 py-2' onClick={() => onNewTaskAddClick()}>
                            <i className="fa-solid fa-plus mr-2 text-[#75787b]" ></i>
                            <p className='text-[#75787b] font-semibold font-quicksand text-sm'>Add New</p>
                        </button>
                    {/* <button className='flex items-center border border-[#dddddf] rounded-lg mb-3 py-2 px-3 mr-6 hover:opacity-75 outline-none focus:outline-none'
                        onClick={onFilterClick}>
                        <i className="fa-solid fa-sliders mr-2 text-[#75787b]"></i>
                        <p className='text-[#75787b] font-semibold font-quicksand text-sm'>Filter</p>
                    </button> */}
                    {/* <button className='flex  items-center py-2 px-3 mb-3 border border-[#dddddf] rounded-lg hover:opacity-75 outline-none focus:outline-none' onClick={() => onNewTaskAddClick()}>
                        <i className="fa-solid fa-plus mr-2 text-[#75787b]" ></i>
                        <p className='text-[#75787b] font-semibold font-quicksand text-sm'>Add New</p>
                    </button> */}
                </div>
            </div>

            <div className=" mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {tasksResults.length > 0 && tasksResults.map((item, index) => {
                    return (
                        <DashboardCard {...item} onEditClick={onTaskEditClick} onTaskComplete={onTaskComplete}/>
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
    const [popoverShow, setPopoverShow] = React.useState(false);
    const btnRef = React.createRef();
    const popoverRef = React.createRef();
    const dispatch = Actions.getDispatch(React.useContext);
    const [openOnHoldReason, showOnHoldReason] = useState(false)
    const { assignee_name, dead_line, employee_name, project_name, employee_id, task_description, created_at, description_link,
        onEditClick, task_id, work_id, module_id, project_id, on_hold_reason, status, onTaskComplete, detailed_description, module_name } = props;
    const [isChecked, setChecked] = useState(status === "Completed")
    let my_task = user_id === employee_id;
    
    const completeTheTask = async (e) => {
        e.preventDefault();
        const formData = {
            work_id: work_id,
            task: task_description,
            task_id: task_id,
            module_id: module_id,
            dead_line: dead_line,
            project_id: project_id,
            on_hold_reason: on_hold_reason,
            status: "Completed",
        }

        let validation_data = [
            { key: "project_id", message: 'Please select the project!' },
            { key: "task", message: `Description field left empty!` },
            { key: "dead_line", message: 'Deadline field left empty!' },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: 'post',
                // navigate: navigate,
                dispatch: dispatch,
                url: update_task(),
                data: { ...formData, dead_line: formattedDeadline(formData.dead_line) },
            })
            if (res.success) {
                onTaskComplete()
                notifySuccessMessage(res.status);
            } else {
                setChecked(false)
                notifyErrorMessage(res.detail)
            }
        } else {
            setChecked(false)
            notifyErrorMessage(message)
        }
    };

    return (
        <React.Fragment>
            <div className='bg-white flex flex-col px-5 py-2 rounded-lg h-full border-borderColor-0 shadow-md' >
                
                    <div className='flex'>
                                <div className='flex flex-col w-full'>
                                    <div className='max-h-14 align-top font-quicksand font-medium flex w-full'>
                                        <a href={description_link === null ? null: description_link}
                                            target="blank"
                                            className={`text-5 ${description_link === null ? "text-blueGray-800" : "text-blue-600 hover:text-blue-700 hover:cursor-default"} font-quicksand font-bold text-lg line-clamp-2 text-ellipsis overflow-x-hidden`}>
                                            {task_description}
                                        </a>
                                        {/* <p className={`text-5 ${description_link === null ? "text-blueGray-800" : "text-blue-600 hover:text-blue-700 hover:cursor-default"} font-quicksand font-bold text-lg line-clamp-2`}></p> */}
                                    </div>
                                    <span className="text-sm font-quicksand font-medium inline-block pb-1 text-blueGray-600 last:mr-0 mr-1 truncate text-ellipsis w-full">
                                                {detailed_description}
                                    </span>

                                    
                                </div>
                        
                    </div>
                    
                    <div onClick={() => {
                        if(status != "Completed"){
                            onEditClick(props)
                        }
                    }}>
                        <div className='flex justify-between my-3'>
                            <span className="text-xs font-semibold font-quicksand inline-block py-1 align-middle px-2 rounded-md text-lightBlue-600 bg-lightBlue-200 last:mr-0 mr-1">
                            {project_name}</span>
                            <span className="text-xs font-semibold font-quicksand inline-block py-1">
                            {module_name}</span>
                        </div>

                        <div className="flex flex-wrap my-2">
                            <div className='mr-auto'>
                                <span className={`text-xs font-quicksand font-semibold inline-block py-1 px-0 rounded-full ${expiredCheck(dead_line) ? 'text-red-400' : 'text-green-400'} last:mr-0 mr-1`}>
                                    <i className="fa-solid fa-clock mr-1"></i> {moment(dead_line).format(DateFormatCard)}
                                </span>
                            </div>

                            <div className='ml-auto'>
                                <span className="text-gray-500 ml-auto mt-1 text-xs font-quicksand font-semibold">{getTimeAgo(created_at)}</span>
                            </div>
                        </div>

                        <div className='flex flex-wrap justify-between items-center'>
                    <span className="text-sm font-quicksand font-normal inline-block py-1 text-blueGray-600 last:mr-0 mr-1 self-center">
                                    Assigned By: {assignee_name === employee_name ? <span className='font-quicksand font-semibold'>Self</span> : <span className='font-quicksand font-semibold'>{assignee_name}</span>}
                        </span>
                        { props.status === "On Hold" && 
                            <div className={`rounded-2xl bg-white pt-0 text-xs font-bold leading-none flex flex-col flex-wrap`}>
                                <span className={`text-yellow-400`} onClick={() => {showOnHoldReason(!openOnHoldReason)}}>{props.status}</span>
                            </div>
                        }
                    </div>

                    </div>
                    
                   

                    { openOnHoldReason && 
                        <div className='border py-1 px-2 rounded-md'>
                            <span className={`text-gray-500 text-sm font-quicksand font-medium my-2 py-4`}>{props.on_hold_reason}</span>
                        </div>
                    }

                    <div className='flex rounded-lg flex-wrap mt-2 items-center'>
                        <img className='w-6 h-6 rounded-full' src={imagesList.employee_default_img.src} alt=''></img>
                        <div className='flex flex-col ml-3'>
                            <p className='text-5 text-black text-sm font-quicksand font-semibold'>{employee_name}</p>
                        </div>
                    </div>
            </div>
        </React.Fragment>

    )
}

