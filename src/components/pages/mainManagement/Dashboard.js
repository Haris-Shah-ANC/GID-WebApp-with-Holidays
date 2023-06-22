import React, { useEffect, useState } from 'react';
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
import Checkbox from '../../custom/Elements/Checkbox';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);

    const { user_id } = getLoginDetails();
    const { work_id } = getWorkspaceInfo();
    const [tasksResults, setTasksResults] = useState([]);
    const [taskCategoryIndex, setTaskCategoryIndex] = useState(0)
    const [btnLabelList, setTaskCount] = useState([{ index: 0, title: "In Progress", count: 0 }, { index: 1, title: "Pending", count: 0 }, { index: 2, title: "Completed", count: 0 }])
    const [postBody, setPostBody] = useState({ "workspace_id": work_id, projects: [], "tasks": ["In-Progress", "On Hold"], "employees": [user_id] })

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});

    const [filters, setFilters] = useState({
        employee_id: null,
        module_id: null,
        project_id: null,
    })


    useEffect(() => {
        getTaskList()
    }, [postBody, work_id])
    

    const getTaskList = async () => {
        let res = await apiAction({ url: getTaskListUrl(), method: 'post', navigate: navigate, dispatch: dispatch, data: postBody })
        if (res.success) {
            console.log("RESPONSE", JSON.stringify(res, 0, 2))
            setTasksResults(res.result)
            btnLabelList[taskCategoryIndex].count = res.result.length
            setTaskCount([...btnLabelList])
        }
    }

    const onCategoryBtnClick = (index) => {
        setTaskCategoryIndex(index)
        if (index === 0) {
            setPostBody({ ...postBody, tasks: ["In-Progress", "On Hold"] })
        } else if (index === 1) {
            setPostBody({ ...postBody, tasks: ["Pending"] })
        } else if (index === 2) {
            setPostBody({ ...postBody, tasks: ["Completed"] })
        }
    }

    const getBtnStyle = (index) => {
        if (index === taskCategoryIndex) {
            return "border-b-4 border-[#2e53e2] rounded"
        }
        return ""
    }

    const onTaskComplete = () => {
        getTaskList()
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
        console.log("FILTER DATA", data)
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

            <div className="bg-white rounded-xl pt-4 flex justify-between shadow">
                <div className='flex-row flex'>
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
                <div className='flex items-center mr-5'>
                    <button className='flex items-center border border-[#dddddf] rounded-lg mb-3 py-2 px-3 mr-6 hover:opacity-75 outline-none focus:outline-none'
                        onClick={onFilterClick}>
                        <i className="fa-solid fa-sliders mr-2 text-[#75787b]"></i>
                        <p className='text-[#75787b] font-semibold font-quicksand text-sm'>Filter & Sort</p>
                    </button>
                    <button className='flex  items-center py-2 px-3 mb-3 border border-[#dddddf] rounded-lg hover:opacity-75 outline-none focus:outline-none' onClick={() => onNewTaskAddClick()}>
                        <i className="fa-solid fa-plus mr-2 text-[#75787b]" ></i>
                        <p className='text-[#75787b] font-semibold font-quicksand text-sm'>Add New</p>
                    </button>



                </div>
            </div>

            <div className=" mt-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tasksResults.map((item, index) => {
                    return (
                        <div className="h-full w-full" key={index}>
                            <DashboardCard {...item} onEditClick={onTaskEditClick} onTaskComplete={onTaskComplete}/>
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
    const [popoverShow, setPopoverShow] = React.useState(false);
    const btnRef = React.createRef();
    const popoverRef = React.createRef();
    const dispatch = Actions.getDispatch(React.useContext);
    const [openOnHoldReason, showOnHoldReason] = useState(false)
    const { assignee, dead_line, employee_name, project_name, employee_id, task, created_at, 
        onEditClick, task_id, work_id, module_id, project_id, on_hold_reason, status, onTaskComplete } = props;
    const [isChecked, setChecked] = useState(status === "Completed")
    let my_task = user_id === employee_id;
    
    const completeTheTask = async (e) => {
        e.preventDefault();
        const formData = {
            work_id: work_id,
            task: task,
            task_id: task_id,
            module_id: module_id,
            dead_line: dead_line,
            project_id: project_id,
            on_hold_reason: on_hold_reason,
            status: "Completed",
        }
        console.log("Task Desc", formData)
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
                        { ((status != "Completed") && (status != "On Hold")) && <input
                                type="checkbox"
                                value={isChecked}
                                onChange={(e) => {
                                    setChecked(!isChecked)
                                    console.log("CHECK CLICK")
                                    completeTheTask(e)
                                }}
                                className="form-checkbox appearance-none w-4 h-4 self-center mr-2 ease-linear transition-all duration-150 border border-blueGray-300 rounded focus:border-blueGray-300"
                                />}
                                <div className='flex flex-col'>
                                    <div className='max-h-14 align-top font-quicksand font-medium flex'>
                                        <p className='text-5 text-blueGray-800 font-quicksand font-bold text-lg line-clamp-2'>{task}</p>
                                    </div>
                                    <span className="text-sm font-quicksand font-medium inline-block pb-1 text-blueGray-600 last:mr-0 mr-1">
                                                {"This is sample task description "}
                                    </span>
                                </div>
                        
                    </div>
                    
                    <div onClick={() => {onEditClick(props)}}>
                        <div className='flex justify-between my-3'>
                            <span className="text-xs font-semibold font-quicksand inline-block py-1 align-middle px-2 rounded-md text-lightBlue-600 bg-lightBlue-200 last:mr-0 mr-1">
                            {project_name}</span>
                            <span className="text-xs font-semibold font-quicksand inline-block py-1">
                            {"Module Name"}</span>
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

                    </div>
                    
                    <div className='flex flex-wrap justify-between items-center'>
                    <span className="text-sm font-quicksand font-normal inline-block py-1 text-blueGray-600 last:mr-0 mr-1 self-center">
                                    Assigned By: {assignee === employee_name ? <span className='font-quicksand font-semibold'>Self</span> : <span className='font-quicksand font-semibold'>{assignee}</span>}
                        </span>
                        { props.status === "On Hold" && 
                            <div className={`rounded-2xl bg-white pt-0 text-xs font-bold leading-none flex flex-col flex-wrap`}>
                                <span className={`text-yellow-400`} onClick={() => {showOnHoldReason(!openOnHoldReason)}}>{props.status}</span>
                            </div>
                        }
                    {/* {props.status === "On Hold" && <StatusComponent {...props} my_task={my_task} />} */}
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

