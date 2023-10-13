import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import Card from '../../custom/Elements/Card';
import { apiAction } from '../../../api/api';
import { employee, getTaskListUrl, getTheCalendarViewTasksUrl, get_task_count_url, post_task, update_task } from '../../../api/urls';
import { getLoginDetails, getWorkspaceInfo } from '../../../config/cookiesInfo';
import { formatDate, formattedDeadline, getCurrentWeekDays, isFormValid, isStartDaySunday, notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils';
import ModelComponent from '../../custom/Model/ModelComponent';
import { add_task, filter_and_sort } from '../../../utils/Constant';
import Dropdown from '../../custom/Dropdown/Dropdown';
import * as Actions from '../../../state/Actions'
import ButtonWithImage from '../../custom/Elements/buttons/ButtonWithImage';
import Loader from '../../../components/custom/Loaders/Loader'
import { json, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import Tooltip from '../../custom/tooltip/Tooltip';

export default function CalendarView(props) {
    const [days, setDays] = useState([])
    const workspace = getWorkspaceInfo()
    const userInfo = getLoginDetails()
    const navigate = useNavigate();
    const state = Actions.getState(useContext)
    const { user_id } = getLoginDetails();

    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [weekNumber, incrementWeek] = useState(0)
    const dispatch = Actions.getDispatch(useContext)
    const [isNetworkCallRunning, setNetworkCallStatus] = useState(false)
    const [postBody, setPostBody] = useState({ "workspace_id": workspace.work_id, projects: [], "tasks": ["In-Progress", "On Hold"], "employees": [user_id] })
    const [listOfEmployees, setEmployees] = useState([])
    const [selectedUser, selectUser] = useState(null)
    const [collapseItem, setCollapseItem] = useState(null)
    const [taskCategoryIndex, setTaskCategoryIndex] = useState(0)
    const [btnLabelList, setTaskCount] = useState([
        { index: 0, title: "In Progress", count: 0 },
        { index: 1, title: "Pending", count: 0 },
        { index: 2, title: "Completed", count: 0 },
        { index: 3, title: "All", count: 0 },
    ])
    const [filters, setFilters] = useState({
        employee_id: null,
        module_id: null,
        project_id: null,
    })
    useEffect(() => {
        getEmployeeResultsApi()
    }, [])

    useEffect(() => {
        const weekDays = getCurrentWeekDays(weekNumber)
        let fromDate = weekDays[0].day.format("YYYY-MM-DD")
        let toDate = weekDays[weekDays.length - 1].day.format("YYYY-MM-DD")

        let getTasksUrl = getTheCalendarViewTasksUrl() + `?dead_line__gte=${fromDate}&dead_line__lte=${toDate}&workspace=${workspace.work_id}`

        let taskCountUrl = get_task_count_url(workspace.work_id) + `&employee_id=${postBody.employees}&project_id=${postBody.projects}`
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

        // if (postBody.pageNumber) {
        //     getTasksUrl = getTasksUrl + `&page=${postBody.pageNumber}`
        // }
        getTaskList(getTasksUrl, weekDays)
        getTaskCount(taskCountUrl)
    }, [postBody, state.workspace, weekNumber])

    const getTaskList = async (url, weekDays) => {
        setNetworkCallStatus(true)
        let res = await apiAction({ url: url, method: 'get', navigate: navigate, dispatch: dispatch, })
        setNetworkCallStatus(false)
        if (res) {
            if (res.results.length > 0) {
                putTasksOnDayWise(organizeTasksByDate(res.results), weekDays)
            } else {
                setDays(weekDays)
            }
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


    const putTasksOnDayWise = (setOfTasksByDay, weekDays) => {
        setDays(weekDays.map(obj => ({ ...obj, tasks: obj.day.format("YYYY-MM-DD") in setOfTasksByDay ? combineResponseTasksWithDummyTasks(setOfTasksByDay[obj.day.format("YYYY-MM-DD")]) : getEmptyTasks(10) })))
    }

    const combineResponseTasksWithDummyTasks = (responseTasks) => {
        let listOfTasks = []
        for (let index = 0; index < responseTasks.length; index++) {
            listOfTasks.push(responseTasks[index])
        }
        return listOfTasks.concat(responseTasks.length < 10 ? getEmptyTasks(10 - responseTasks.length) : [])
    }
    const getEmployeeResultsApi = async () => {
        let res = await apiAction({
            url: employee(workspace.work_id),
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
        })
        if (res.success) {
            selectUser(res.results.find((item, index) => item.id === user_id))
            setEmployees([{ employee_name: 'All' }, ...res.results])
        }
    }
    const getEmptyTasks = (length) => {
        let emptyTaskList = []
        for (let i = 0; i < length; i++) {
            emptyTaskList.push({
                "task_description": "",
            })
        }
        return emptyTaskList
    }

    const organizeTasksByDate = (responseResults) => {
        let tasksGroupByDate = {}
        for (let index = 0; index < responseResults.length; index++) {
            const date = formatDate(responseResults[index].created_at, "YYYY-MM-DD")
            if (date in tasksGroupByDate) {
                tasksGroupByDate[date].push(responseResults[index])
            } else {
                tasksGroupByDate[date] = []
                tasksGroupByDate[date].push(responseResults[index])
            }
        }
        return tasksGroupByDate
    }

    const onTaskClick = (item, index) => {
        setFormData({
            task: item.task_description,
            module_id: null,
            work_id: item.workspace,
            status: item.status,
            task_id: item.id,
            project_id: item.project,
            on_hold_reason: item.on_hold_reason,
            description_link: item.description_link,
            detailed_description: item.detailed_description,
            dead_line: moment(item.dead_line).format("YYYY-MM-DD HH:mm"),
            assignee_id: item.assignee_id,
            employee: item.employee
        });
        setShowModal(add_task)
    }

    const onCategoryBtnClick = (index) => {
        if (index === 0) {
            setPostBody({ ...postBody, tasks: ["In-Progress", "On Hold"] })
        } else if (index === 1) {
            setPostBody({ ...postBody, tasks: ["Pending"] })
        } else if (index === 2) {
            setPostBody({ ...postBody, tasks: ["Completed"] })
        } else if (index === 3) {
            setPostBody({ ...postBody, tasks: ["In-Progress", "On Hold", "Pending", "Completed"] })
        }
        setTaskCategoryIndex(index)
    }

    const onTaskStatusBtnClick = (item, index) => {

    }

    const isToday = (item, defaultColor) => {
        return moment().format("DD-MM") === item.day.format("DD-MM") ? "text-blue-500" : defaultColor
    }
    const getBtnStyle = (index) => {
        if (index === taskCategoryIndex) {
            return "border-b-4 border-[#2e53e2] rounded"
        }
        return ""
    }
    const onFilterClick = () => {
        setFormData(filters);
        setShowModal(filter_and_sort)
    }
    const onNewTaskAddClick = (item) => {
        setFormData();
        setShowModal(add_task)
    }
    const onFilterApply = (data) => {

        setFilters(data)

        if (data.module_id) {
            // pBody["module_id"] = [data.module_id]
        } else {
            // pBody["module_id"] = [data.module_id]
        }
        if (data.project_id) {
            postBody["projects"] = [data.project_id]
        } else {
            postBody["projects"] = []
        }

        if (postBody !== {}) {
            setPostBody({ ...postBody })
        }
    }
    const onFilterClear = () => {
        setFilters({
            module_id: null,
            project_id: null,
        })
        setPostBody({ ...postBody, projects: [], })
    }
    const getInitialsOfEmployeeName = (name) => {
        let nameArray = String(name).split(" ")
        if (nameArray.length > 1 && nameArray[0] != " ") {
            return nameArray[0][0] + nameArray[1][0]
        } else {
            return nameArray[0][0]
        }
    }



    const TaskItem = (props) => {
        const { item, onTaskClick, onTaskStatusBtnClick, index } = props
        return (
            <div className={`border-b py-2 flex items-center group hover:border-b-blue-300 ${item.id && 'cursor-pointer'}`} onClick={() => {
                if (item.status && item.status != "Completed") {
                    onTaskClick(item, index)
                }
            }} >

                {item.id ?
                    <>
                        <div class="bg-blue-200 w-[28px] h-6 inline-flex items-center justify-center rounded-full text-xs p-1 uppercase tracking-wider text-blue-800" >
                            {getInitialsOfEmployeeName(item.employee_name)}

                        </div>
                        <Tooltip text={item.employee_name} />

                    </> :
                    <div className='h-6'></div>
                }
                <span className={`px-1 w-full font-quicksand font-medium text-sm tracking-normal ${collapseItem == item.id ? "" : "truncate"}`}>{item.task_description}</span>
                <svg onClick={(e) => {
                    if (collapseItem == item.id) {
                        setCollapseItem(null)
                    } else {
                        setCollapseItem(item.id)
                    }
                    e.stopPropagation()
                }} viewBox="0 0 24 24" fill="currentColor" height="24px" width="24px" className='self-end group-hover:fill-gray-500 fill-white m-2'>
                    <path d="M16.293 9.293L12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z" />
                </svg>
                {/* {
                    item.status === "Completed" ?
                        <svg onClick={() => alert("test")} className='self-end group-hover:fill-gray-500 fill-white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg>
                        :

                        <svg onClick={(e) => {
                            if (collapseItem == item.id) {
                                setCollapseItem(null)
                            } else {
                                setCollapseItem(item.id)
                            }
                            e.stopPropagation()
                        }} viewBox="0 0 24 24" fill="currentColor" height="24px" width="24px" className='self-end group-hover:fill-gray-500 fill-white m-2'>
                            <path d="M16.293 9.293L12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z" />
                        </svg>
                } */}

            </div>
        )

    }

    return (
        <React.Fragment>
            {/* <ModelComponent showModal={showModal} setShowModal={setShowModal} data={formData} onFilterApply={onFilterApply} onFilterClear={onFilterClear} /> */}

            <div className='rounded-lg'>
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
                <div className='py-2 px-4 flex justify-between items-center bg-white mt-6'>

                    <span className='font-quicksand font-bold text-2xl text-blue-600'>{days.length > 0 ? days[0].day.format("MMM YYYY") : moment().format("MMM YYYY")}</span>

                    <div className='flex space-x-5'>

                        <ButtonWithImage className={'cursor-pointer w-8 h-8 rounded-full border-dark-purple justify-center flex p-0 m-0 group'} title={""} iconStyle={`mr-0`} disabled={false} onButtonClick={() => { incrementWeek(weekNumber - 1) }}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8 p-[8px] align-baseline fill-white rounded-full bg-blue-500 group-hover:bg-blue-600 shadow-xl' height="1em" viewBox="0 0 320 512">
                                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" /></svg>}>
                        </ButtonWithImage>

                        <ButtonWithImage className={'cursor-pointer w-8 h-8 rounded-full border-dark-purple justify-center flex p-0 m-0 group'} title={""} iconStyle={`mr-0`} disabled={false} onButtonClick={() => { incrementWeek(weekNumber + 1) }}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8 p-[8px] align-baseline fill-white rounded-full bg-blue-500 group-hover:bg-blue-600 shadow-xl' height="1em" viewBox="0 0 320 512">
                                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" /></svg>}>
                        </ButtonWithImage>

                    </div>

                </div>

                <div style={{
                    padding: '0px',
                    overflowY: 'scroll',
                    height: 'calc(100vh - 240px)',

                }} className='grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 p-4 bg-white '>
                    {days.map((item, index) => {
                        return <div className='flex flex-col space-x-0 p-2 space-y-2 w-full md:w-1/6 md:space-x-2'>


                            <div className='flex justify-between'>
                                <span className={`text-2xl font-quicksand font-bold ${isToday(item, "text-black")}`}>{item.day.format("DD.MM")}</span>
                                <span className={`text-xl font-quicksand font-semibold ${isToday(item, "text-gray-400")}`}>{item.day.format("ddd")}</span>
                            </div>
                            <div className='h-[2px] bg-black'></div>
                            {
                                item.tasks.map((taskItem, index) => {
                                    return (
                                        <div>
                                            <Card component={<TaskItem item={taskItem} onTaskClick={onTaskClick} onTaskStatusBtnClick={onTaskStatusBtnClick} index={index}></TaskItem>} className={"shadow-none"}></Card>
                                        </div>)
                                })
                            }
                        </div>
                    })
                    }
                </div>

            </div>
            <ModelComponent showModal={showModal} setShowModal={setShowModal} data={formData} onFilterApply={onFilterApply} onFilterClear={onFilterClear} from={"calender_view"} />
            {isNetworkCallRunning && <Loader></Loader>}
        </React.Fragment>
    )
}




