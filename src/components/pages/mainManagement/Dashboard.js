import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Card from '../../custom/Cards/Card';
import { apiAction } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import * as Actions from '../../../state/Actions';
import Dropdown from '../../custom/Dropdown/Dropdown';
import { DateFormatCard, add_task, create_new_work_space, imagesList } from '../../../utils/Constant';
import ModelComponent from '../../custom/Model/ModelComponent';
import { createPopper } from "@popperjs/core";

import {
    get_task,
    employee,
    get_all_project,
    getTaskListUrl,
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

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);

    const { user_id } = getLoginDetails();
    const { work_id } = getWorkspaceInfo();
    const [tasksResults, setTasksResults] = useState([]);
    const [employeeResults, setEmployeeResults] = useState([]);
    const [projectsResults, setProjectsResults] = useState([]);
    const [taskCategoryIndex, setTaskCategoryIndex] = useState(0)
    const [btnLabelList,setTaskCount] = useState([{ title: "In Progress", count: 0 }, { title: "Pending", count: 0 }, { title: "Completed", count: 0 }])
    const [postBody, setPostBody] = useState({ "workspace_id": work_id,projects:[], "tasks": ["In-Progress", "On Hold"], "employees": [user_id] })

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});

    const [filters, setFilters] = useState({
        project_id: null,
        employee_id: user_id,
    })


    useEffect(() => {
        if (work_id) {
            // getTaskResultsApi(work_id);
            getEmployeeResultsApi(work_id);
            getProjectsResultsApi(work_id);
        }
    }, [work_id])

    useEffect(() => {
        getTaskList()
    }, [postBody])

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

    const getTaskList = async () => {
        let res = await apiAction({ url: getTaskListUrl(), method: 'post', navigate: navigate, dispatch: dispatch, data: postBody })
        if (res.success) {
            setTasksResults(res.result)
            btnLabelList[taskCategoryIndex].count = res.result.length
            setTaskCount([...btnLabelList])
        }
    }

    const onCategoryBtnClick = (index) => {
        setTaskCategoryIndex(index)
        if(index===0){
            setPostBody({...postBody,tasks:["In-Progress","On Hold"]})
        }else if(index===1){
            setPostBody({ ...postBody, tasks: ["Pending"] })
        }else if(index===2){
            setPostBody({ ...postBody, tasks: ["Completed"] })
        }
    }

    const getBtnStyle = (index) => {
        if (index === taskCategoryIndex) {
            return "border-b-4 border-[#2e53e2] rounded"
        }
        return ""
    }

    const onEditClick = (item) => {
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

    return (
        <React.Fragment>
            <ModelComponent showModal={showModal} setShowModal={setShowModal} data={formData} />
            {/* <Filter
                filters={filters}
                setFilters={setFilters}
                employeeResults={employeeResults}
                projectsResults={projectsResults}
            /> */}
            
            <div className="bg-white rounded-xl pt-4 flex justify-between shadow">
                <div className='flex-row flex'>
                    {btnLabelList.map((item, index) => {
                        { console.log("BTN ", item) }
                        return (
                            <div className={`flex flex-row px-0.5 mx-5 pb-3 items-center ${getBtnStyle(index)}`} >
                                <button className={classNames("flex font-quicksand font-bold flex-row items-center text-md hover:opacity-75  outline-none focus:outline-none", {
                                    "text-[#b7c1cc]": index!==taskCategoryIndex,
                                    "text-[#2e53e2]":index===taskCategoryIndex})} onClick={() => onCategoryBtnClick(index)}>
                                    {item.title}
                                </button>
                                <p className={classNames("px-1 text-xs mx-2 text-white rounded", {
                                    "bg-[#2e53e2]":index===taskCategoryIndex,
                                    "bg-[#b7c1cc]":index!==taskCategoryIndex})}>{item.count}</p>
                            </div>
                        )
                    })}

                </div>
                <div className='flex items-center mr-5'>
                    <button className='flex items-center border border-[#dddddf] rounded-lg mb-3 py-2 px-3 mr-6 hover:opacity-75 outline-none focus:outline-none'>
                        <i className="fa-solid fa-sliders mr-2 text-[#75787b]"></i>
                        <p className='text-[#75787b] font-medium'>Filter & Sort</p>
                    </button>
                    <button className='flex  items-center py-2 px-3 mb-3 border border-[#dddddf] rounded-lg hover:opacity-75 outline-none focus:outline-none'>
                        <i className="fa-solid fa-plus mr-2 text-[#75787b]" ></i>
                        <p className='text-[#75787b] font-medium'>Add New</p>
                    </button>



                </div>
            </div>

            <div className=" mt-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredTask(tasksResults, filters).map((item, index) => {
                    return (
                        <div className="h-full w-full" key={index}>
                            <DashboardCard {...item} onEditClick={onEditClick}/>
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
    const { assignee, dead_line, employee_name, project_name, employee_id, task, created_at, onEditClick } = props;

    let my_task = user_id === employee_id;

    const openPopover = () => {
        createPopper(btnRef.current, popoverRef.current, {
          placement: "left"
        });
        setPopoverShow(true);
      };
      const closePopover = () => {
        setPopoverShow(false);
      };

    return (
        <React.Fragment>
            <div className='bg-white flex flex-col p-5 rounded-lg h-full border-borderColor-0 shadow-md' >
                
                
                <div className='flex justify-between'>
                    <span className="text-xs font-semibold font-quicksand inline-block py-1 px-2 rounded-xl text-lightBlue-600 bg-lightBlue-200 last:mr-0 mr-1">
                    {project_name}</span>
                    {/* <i class="fa-solid fa-ellipsis fa-lg" style={{color: "#b4bcc2"}} onClick={() => {popoverShow ? closePopover() : openPopover();}} ref={btnRef}></i> */}
                    <span className="text-xs font-semibold font-quicksand inline-block py-1 px-2 last:mr-0 mr-1">
                    {"Module Name"}</span>
                </div>
                <div onClick={() => {onEditClick(props)}}>
                    <div className='flex flex-col'>
                        <div className='mt-4 h-12 justify-center align-middle font-quicksand font-medium flex flex-col'>
                            <p className='text-5 text-blueGray-800 font-sans line-clamp-2'>{task}</p>
                        </div>
                        <span className="text-xs font-quicksand font-normal inline-block py-1 text-blueGray-600 last:mr-0 mr-1">
                                    Assigned By: {assignee === employee_name ? <span className='font-quicksand font-semibold'>Self</span> : <span className='font-quicksand font-semibold'>{assignee}</span>}
                        </span>
                    </div>
                    
                    <div className='flex rounded-lg flex-wrap mt-2 items-center'>
                        <img className='w-6 h-6 rounded-full' src={imagesList.employee_default_img.src} alt=''></img>
                        <div className='flex flex-col ml-3'>
                            <p className='text-5 text-black text-xs font-quicksand font-medium'>{employee_name}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap mt-2">
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
                {props.status === "On Hold" && <StatusComponent {...props} my_task={my_task} />}
            </div>
            <PopUpMenu popoverRef={popoverRef} popoverShow={popoverShow} onTaskEditClick={""} onTaskCompleteClick={""} taskData={props}></PopUpMenu>
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
    const [isEditing, setIsEditing] = useState(false);
    const [openOnHoldReason, showOnHoldReason] = useState(false)
    // const [editedText, setEditedText] = useState(on_hold_reason);

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
                    <div className={`rounded-2xl bg-white pt-0 text-xs font-bold leading-none flex flex-col flex-wrap`}>
                        <span className={`text-yellow-400`} onClick={() => {showOnHoldReason(!openOnHoldReason)}}>{status}</span>
                        { openOnHoldReason && 
                            <span className={`text-gray-500 font-quicksand font-semibold my-2`}>{on_hold_reason}</span>
                        }
                    </div>
                )}

                {/* {my_task && (
                    <div
                        onClick={handleEditClick}
                        className="ml-auto rounded-full bg-white flex justify-center items-center shadow cursor-pointer"
                    >
                        {isEditing ? (
                            status === "On Hold" ? (
                                <span className="text-yellow-400">
                                    <i className="fa-sharp fa-solid fa-circle-pause fa-fa-lg"></i>
                                </span>
                            ) : (
                                <span className="text-green-400">
                                    <i className="fa-regular fa-circle-play fa-fa-lg"></i>
                                </span>
                            )
                        ) : (
                            status === "On Hold" ? (
                                <span className="text-green-400">
                                    <i className="fa-regular fa-circle-play fa-lg"></i>
                                </span>
                            ) : (
                                <span className="text-yellow-400">
                                    <i className="fa-sharp fa-solid fa-circle-pause fa-lg"></i>
                                </span>
                            )
                        )}
                    </div>
                )} */}

            </div>

            {/* {
                isEditing && (
                    <div className="mt-3">
                        <textarea
                            placeholder="Enter the reason for putting the task on hold"
                            value={editedText ? editedText : ''}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="w-full h-20 p-2 border border-gray-300 rounded font-quicksand font-semibold text-sm"
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
            } */}
        </React.Fragment >
    )
}
