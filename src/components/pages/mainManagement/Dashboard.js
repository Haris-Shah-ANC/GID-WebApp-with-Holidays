import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import Card from '../../custom/Cards/Card';
import { apiAction } from '../../../api/api';
import { json, useLocation, useNavigate } from 'react-router-dom';
import * as Actions from '../../../state/Actions';
import Dropdown from '../../custom/Dropdown/Dropdown';
import { DateFormatCard, add_task, add_time_sheet, create_new_work_space, filter_and_sort, imagesList } from '../../../utils/Constant';
import ModelComponent from '../../custom/Model/ModelComponent';
import { isFormValid, notifyErrorMessage, notifySuccessMessage, formattedDeadline, history } from '../../../utils/Utils'

import {
    get_task,
    employee,
    get_all_project,
    getTaskListUrl,
    update_task,
    get_task_count_url,
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
import { Box, Modal, Pagination, Stack, Tooltip, Typography } from '@mui/material';
import NewModal from '../../custom/Model/NewModal';
import CommentsSideBar from '../../custom/Model/RigthSideBar';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);
    history.navigate = useNavigate();
    history.location = useLocation();

    const loginDetails = getLoginDetails();
    const user_id = loginDetails.user_id
    const state = Actions.getState(useContext)
    const { work_id } = getWorkspaceInfo();
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
    const [showModal, setShowModal] = useState(false)
    const [postBody, setPostBody] = useState({ "workspace_id": work_id, projects: [], "tasks": ["In-Progress", "On Hold"], "employees": [user_id] })
    const [showCommentSideBar, setCommentSideBarVisibility] = useState(false);
    const [formData, setFormData] = useState({});
    const [paginationData, setPaginationData] = useState(0)
    const [filters, setFilters] = useState({
        employee_id: null,
        module_id: null,
        project_id: null,
    })
    const [selectedTask, setSelectedTask] = useState(false);
    const [open, setOpen] = useState(false)
    const [onHoldReason, setOnHoldReason] = useState('')

    ////////////////////////////////////////////////////////////////
    // const [openCommentIndex, setOpenCommentIndex] = useState(null);

    // const toggleCommentSection = (e, task, props) => {
    //     if (selectedTask.id === task) {
    //         // Clicking the same card's button again should close it
    //         setCommentSideBarVisibility(!showCommentSideBar);
    //         console.log("selectedTask===>",selectedTask.id)
    //         e.preventDefault();
    //         setSelectedTask(props)
    //     } else {
    //         // Clicking a different card's button should open it
    //         setCommentSideBarVisibility(true);
    //     }
    // };

    /////////////////////////////////////////////////
    useEffect(() => {
        let getTasksUrl = get_task() + `?created_at__date__gte=&created_at__date__lte=&workspace=${work_id}`

        let taskCountUrl = get_task_count_url(work_id) + `&employee_id=${postBody.employees}&project_id=${postBody.projects}`
        if (postBody.employees != "") {
            taskCountUrl = taskCountUrl + `&employee_id=${postBody.employees}`
            getTasksUrl = getTasksUrl + `&employee__in=${postBody.employees}`
        }
        if (postBody.projects != "") {
            taskCountUrl = taskCountUrl + `&project_id=${postBody.projects}`
            getTasksUrl = getTasksUrl + `&project__in=${postBody.projects}`

        }
        if (taskCategoryIndex !== 3) {
            taskCountUrl = taskCountUrl + `&status_id=${postBody.tasks}`
            getTasksUrl = getTasksUrl + `&status__in=${postBody.tasks}`
        }
        if (postBody.pageNumber) {
            getTasksUrl = getTasksUrl + `&page=${postBody.pageNumber}`
        }
        getTaskList(getTasksUrl)
        getTaskCount(taskCountUrl)
    }, [postBody, state.workspace])

    useEffect(() => {
        getEmployeeResultsApi()
    }, [])


    const getTaskList = async (URL) => {
        let res = await apiAction({ url: URL, method: 'get', navigate: navigate, dispatch: dispatch })
        if (res) {
            setPaginationData(res.total_pages)
            setTasksResults(res.results)
        }
    }
    const getTaskCount = async (URL) => {
        let res = await apiAction({ url: URL, method: 'get', navigate: navigate, dispatch: dispatch })
        if (res) {
            const responseData = res.result
            btnLabelList[0].count = responseData.in_progress + responseData.on_hold
            btnLabelList[1].count = responseData.pending
            btnLabelList[2].count = responseData.completed
            btnLabelList[3].count = responseData.all_tasks
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
        if (res) {
            selectUser(res.results.find((item, index) => item.id === user_id))
            setEmployees([{ employee_name: 'All' }, ...res.results])
        }
    }

    const onCategoryBtnClick = (index) => {
        if (index === 0) {
            setPostBody({ ...postBody, tasks: ["In-Progress", "On Hold"] })
        } else if (index === 1) {
            setPostBody({ ...postBody, tasks: ["Pending"] })
        } else if (index === 2) {
            setPostBody({ ...postBody, tasks: ["Completed"] })
        } else if (index === 3) {
            setPostBody({ ...postBody, tasks: ["In - Progress", "On Hold", "Completed", "Pending"] })

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
        console.log("ITEM", item)
        setFormData({
            task: item.task_description,
            module_id: null,
            work_id: work_id,
            status: item.status,
            task_id: item.id,
            project_id: item.project,
            on_hold_reason: item.on_hold_reason,
            detailed_description: item.detailed_description,
            dead_line: moment(item.dead_line).format("YYYY-MM-DD HH:mm"),
            description_link: item.description_link,
            assignee_id: item.assignee_id,
            employee: item.employee
        });
        setShowModal(add_task)
    }

    const onNewTaskAddClick = (item) => {
        setFormData();
        setShowModal(add_task)
    }

    const onFilterApply = (data) => {

        setFilters(data)
        let pBody = { ...postBody, workspace_id: work_id }
        // if (data.employee_id) {
        //     pBody["employees"] = [data.employee_id]
        // } else {
        //     pBody["employees"] = []
        // }
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
            module_id: null,
            project_id: null,
        })
        setPostBody({ ...postBody, projects: [] })
    }

    const onFilterClick = () => {
        setFormData(filters);
        setShowModal(filter_and_sort)
    }
    const onPaginationHandle = (pageNumber) => {
        setPostBody({ ...postBody, pageNumber: pageNumber })
    }


    const onHoldClick = () => {
        setOpen(true)
    }
    const DashboardCard = (props) => {
        const { user_id } = getLoginDetails(useNavigate());
        const [popoverShow, setPopoverShow] = React.useState(false);
        const btnRef = React.createRef();
        const popoverRef = React.createRef();
        const dispatch = Actions.getDispatch(React.useContext);
        const [openOnHoldReason, showOnHoldReason] = useState(false)
        const { assignee_name, dead_line, employee_name, project_name, employee_id, task_description, created_at, description_link,
            onEditClick, task_id, work_id, module_id, project_id, on_hold_reason, status, onTaskComplete, detailed_description, module_name, employee, onHoldClick } = props;
        const [isChecked, setChecked] = useState(status === "Completed")
        let my_task = user_id === employee_id;
        let projectStyle = []
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
                if (res) {
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
        const getProjectNameStyle = (projectName) => {
            var randomColor = getRandomColor()
            if (projectStyle != []) {
                projectStyle.find((item, index) => {
                    if (item.projName == projectName) {
                        return item.color
                        // return `bg-[${item.color}] text-[${item.color}]`
                    } else if (index === projectStyle.length - 1) {
                        projectStyle.push({ projName: projectName, color: randomColor })
                        return randomColor
                        // return `bg-[${randomColor}] text-[${randomColor}]`
                    }
                })
            } else {
                projectStyle.push({ projName: projectName, color: randomColor })
                return randomColor
                // return `bg-[${randomColor}] text-[${randomColor}]`
            }
        }
        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            // return "bg-[" + color + "]"
            return color
        }
        const onAddTimeSheetClick = (item) => {
            setShowModal(add_time_sheet)

        }


        return (
            <React.Fragment>

                <div className={`bg-white flex flex-col px-5 py-2 rounded-lg h-full border-borderColor-0 shadow-md  `} onClick={(e) => {
                    // e.preventDefault()
                    // if (user_id === employee) {
                    //     onEditClick(props)
                    // }
                }}>

                    <div className='flex'>
                        <div className='flex flex-col w-full'>

                            <div className={`max-h-14 align-top font-quicksand font-medium flex w-full  `} >
                                <a href={description_link === null ? null : description_link}
                                    target="blank"
                                    className={`text-5  ${description_link === null ? "text-blueGray-800" : "text-blue-600 hover:text-blue-700 "} font-quicksand font-bold text-lg line-clamp-2 text-ellipsis overflow-x-hidden`}
                                >
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
                        if (user_id === employee) {
                            console.log(user_id, employee)
                            onEditClick(props)
                        }
                    }} className={` ${(user_id === employee) ? "cursor-pointer" : ""}`}>
                        <div className='flex justify-between my-3'>
                            <span className="text-xs font-semibold font-quicksand inline-block py-1 align-middle px-2 rounded-md text-lightBlue-600 bg-lightBlue-200 last:mr-0 mr-1">
                                {project_name}
                            </span>
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



                    </div>
                    <div className='flex flex-wrap justify-between items-center '>
                        <span className="text-sm font-quicksand font-normal inline-block py-1 text-blueGray-600 last:mr-0 mr-1 self-center">
                            Assigned By: {assignee_name === employee_name ? <span className='font-quicksand font-semibold'>Self</span> : <span className='font-quicksand font-semibold'>{assignee_name}</span>}
                        </span>
                        {props.status === "On Hold" &&
                            <div className={`rounded-2xl bg-white pt-0 text-xs font-bold leading-none flex flex-col flex-wrap cursor-pointer`}>
                                <span className={`text-yellow-400 hover:text-yellow-600`} onMouseDown={(e) => {

                                    // showOnHoldReason(!openOnHoldReason)
                                    setOnHoldReason(on_hold_reason)
                                    onHoldClick(true)
                                }}>{props.status}</span>
                            </div>
                        }
                    </div>
                    {openOnHoldReason &&
                        <div className='border py-1 px-2 rounded-md'>
                            <span className={`text-gray-500 text-sm font-quicksand font-medium my-2 py-4`}>{props.on_hold_reason}</span>
                        </div>
                    }

                    <div className='flex flex-row rounded-lg flex-wrap mt-2 items-center justify-between'>

                        <div className='flex flex-row ml-0 items-center justify-between '>
                            <img className='w-6 h-6 rounded-full' src={imagesList.employee_default_img.src} alt=''></img>
                            <p className='text-5 ml-3 text-black text-sm font-quicksand font-semibold'>{employee_name}</p>

                            {/* <div className='mx-2 cursor-pointer group flex relative' onClick={onAddTimeSheetClick}>
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    height="1em"
                                    width="1em"
                                >
                                    <path d="M13 14h-2V8h2v6m2-13H9v2h6V1M5 13a6.995 6.995 0 0113.79-1.66l.6-.6c.32-.32.71-.53 1.11-.64a8.59 8.59 0 00-1.47-2.71l1.42-1.42c-.45-.51-.9-.97-1.41-1.41L17.62 6c-1.55-1.26-3.5-2-5.62-2a9 9 0 00-9 9c0 4.63 3.5 8.44 8 8.94v-2.02c-3.39-.49-6-3.39-6-6.92m8 6.96V22h2.04l6.13-6.12-2.04-2.05L13 19.96m9.85-6.49l-1.32-1.32c-.2-.2-.53-.2-.72 0l-.98.98 2.04 2.04.98-.98c.2-.19.2-.52 0-.72z" />
                                </svg>
                                <span className=" pointer-events-none group-hover:opacity-100 transition-opacity bg-gray-500 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto w-max">Add efforts</span>
                            </div> */}

                        </div>
                        <svg
                            viewBox="0 0 24 24"
                            fill="#727273"
                            height="1em"
                            width="1em"
                            className='cursor-pointer hover:fill-blue-500 '
                            onMouseDown={(e) => {
                                // console.log("selected Task ==>", selectedTask)
                                e.preventDefault();
                                setSelectedTask(props)
                                setCommentSideBarVisibility(true)
                                // toggleCommentSection(e, selectedTask.id, props)
                            }}
                        >
                            <path d="M19 8h-1V5a3 3 0 00-3-3H5a3 3 0 00-3 3v12a1 1 0 00.62.92A.84.84 0 003 18a1 1 0 00.71-.29l2.81-2.82H8v1.44a3 3 0 003 3h6.92l2.37 2.38A1 1 0 0021 22a.84.84 0 00.38-.08A1 1 0 0022 21V11a3 3 0 00-3-3zM8 11v1.89H6.11a1 1 0 00-.71.29L4 14.59V5a1 1 0 011-1h10a1 1 0 011 1v3h-5a3 3 0 00-3 3zm12 7.59l-1-1a1 1 0 00-.71-.3H11a1 1 0 01-1-1V11a1 1 0 011-1h8a1 1 0 011 1z" />
                        </svg>
                    </div>
                </div>

            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            {showCommentSideBar &&
                <CommentsSideBar showModal={showCommentSideBar} setShowModal={setCommentSideBarVisibility} taskData={selectedTask} />
            }

            {/* <NewModal isVisible={false} /> */}
            <ModelComponent showModal={showModal} setShowModal={setShowModal} data={formData} onFilterApply={onFilterApply} onFilterClear={onFilterClear} from={"dashboard"} />
            {/* <Filter
                filters={filters}
                setFilters={setFilters}
                employeeResults={employeeResults}
                projectsResults={projectsResults}
            /> */}

            <div className="bg-white rounded-xl flex flex-col md:flex-row justify-between shadow overflow-auto">
                <div className='flex-row flex'>
                    {btnLabelList.map((item, index) => {
                        return (
                            <div className={`flex flex-row px-0.5 mx-5 items-center ${getBtnStyle(index)}`} >
                                <button className={classNames("flex font-quicksand font-bold flex-row items-center text-md hover:opacity-75  outline-none focus:outline-none py-6", {
                                    "text-[#b7c1cc]": index !== taskCategoryIndex,
                                    "text-[#2e53e2]": index === taskCategoryIndex
                                })} onClick={() => onCategoryBtnClick(index)}>
                                    {item.title}

                                    <p className={classNames("px-1 text-xs mx-2 text-white rounded", {
                                        "bg-[#2e53e2]": index === taskCategoryIndex,
                                        "bg-[#b7c1cc]": index !== taskCategoryIndex
                                    })}>{item.count}</p>
                                </button>
                            </div>
                        )
                    })}

                </div>

                <div className='flex flex-col md:flex-row ml-2 space-x-0 space-y-3 items-start md:space-x-3 md:space-y-0 md:items-center mr-5 w-1/2 justify-end'>
                    <div className='max-w-sm w-full'>
                        <Dropdown options={listOfEmployees} optionLabel="employee_name" value={selectedUser ? selectedUser : { employee_name: 'All Users' }} setValue={(value) => {
                            selectUser(value)
                            setTasksResults([])
                            setPostBody({ ...postBody, employees: [value.id] })
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
                </div>
            </div>
            <div className='pb-6'
                style={{
                    padding: '0px',
                    overflowY: 'scroll',
                    height: 'calc(100vh - 215px)',
                }}>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-6 ">
                    {tasksResults.length > 0 && tasksResults.map((item, index) => {
                        return (
                            <DashboardCard {...item} onEditClick={onTaskEditClick} onTaskComplete={onTaskComplete} onHoldClick={onHoldClick} />
                        )
                    })}
                </div>
            </div>
            <div className='bg-white shadow rounded-xl bottom-0  w-full py-2'>
                <Box sx={{
                    display: 'flex',
                    width: ' 100%',
                    objectPosition: 'bottom',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'

                }}>
                    <Stack spacing={2}>
                        <Pagination
                            count={paginationData}
                            color="primary"
                            onChange={(val, pageNumber) => onPaginationHandle(pageNumber)}
                        />
                    </Stack>
                    {/* <span style={{ textAlign: 'right', justifyContent: 'end' }}>
                       page 1 of 1
                    </span> */}
                </Box >
                <ReasonModal open={open} handleClose={() => setOpen(!open)} reason={onHoldReason} />
            </div>
        </React.Fragment>
    )
}

export default Dashboard;

const ReasonModal = (props) => {
    const { open, handleClose, reason } = props

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 1,
        p: 2
    };
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" className='font-quicksand'>
                    Reason
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }} className='text-gray-800 font-quicksand'>
                    {reason}
                </Typography>
            </Box>
        </Modal>
    )
}
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
