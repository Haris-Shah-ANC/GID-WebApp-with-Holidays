import React, { useEffect, useState } from 'react'
import { apiAction } from '../../../api/api'
import { getTheModuleProgressPeriodicTasksUrl, getTheNotificationTypesUrl, getThePeriodScheduleTask, getThePeriodicNotificationsGetUrl, get_all_project, get_project_module } from '../../../api/urls'
import { getLoginDetails, getWorkspaceInfo } from '../../../config/cookiesInfo'
import { formatDate, formatTime, isFormValid, notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import CustomLabel from '../../custom/Elements/CustomLabel'
import Dropdown from '../../custom/Dropdown/Dropdown'
import * as Actions from '../../../state/Actions';
import PlainButton from '../../custom/Elements/buttons/PlainButton'
import IconInput from '../../custom/Elements/inputs/IconInput'
import ModelComponent from '../../custom/Model/ModelComponent'
import { delete_notification } from '../../../utils/Constant'

export default function Analytics(props) {
    const [listOfModules, setModules] = useState([])
    const [listOfProjects, setProjects] = useState([])
    const { work_id } = getWorkspaceInfo()
    const [formData, setFormData] = useState({ project_id: null, workspace_id: work_id, module_id: null, time_list: [], today: false })
    const [listOfNotifications, setNotifications] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [selectedNotification, selectNotification] = useState(null)
    //================================  Fetch projects ========================================//
    useEffect(() => {
        fetchPeriodicNotifications(work_id)
    }, [])

    React.useEffect(() => {
        if (work_id && formData.project_id) {
            fetchModules(work_id, formData.project_id)
        }
    }, [work_id, formData.project_id])
    const fetchProjects = async (id) => {
        let res = await apiAction({
            method: 'get',
            // navigate: navigate,
            // dispatch: dispatch,
            url: get_all_project(id),
        })
        if (res.success) {
            setProjects([{ project_name: 'Select project' }, ...res.result])
        }
    }

    //================================  Fetch Project Modules ========================================//
    const fetchModules = async (w_id, p_id) => {
        let res = await apiAction({
            method: 'get',
            // navigate: navigate,
            // dispatch: dispatch,
            url: get_project_module(w_id, p_id),
        })
        if (res.success) {
            setModules([{ module_name: 'Select module' }, ...res.project_module_list])
        }
    }

    //================================  Fetch Periodic Notifications ========================================//
    const fetchPeriodicNotifications = async (w_id) => {
        let res = await apiAction({
            method: 'get',
            // navigate: navigate,
            // dispatch: dispatch,
            url: getThePeriodicNotificationsGetUrl(w_id),
        })
        if (res.success) {
            setNotifications(res.result)
        }
    }

    const onNewPeriodicNotificationAdd = () => {
        fetchPeriodicNotifications(work_id)
    }


    const onNotificationDelete = (item) => {
        selectNotification(item)
        setShowModal(delete_notification)

    }
    return (
        <div className=' flex flex-col pb-16'>
            <ModelComponent showModal={showModal} setShowModal={setShowModal} data={selectedNotification} onFilterApply={() => { }} onFilterClear={() => { }} from={"notification"} />
            <div className=''>

                <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-3'>
                    <div class="items-center p-10 flex justify-center">
                        <img className='w-3/4 self-center' src="https://gid.artdexandcognoscis.com/static/img/undraw_new_notifications_re_xpcv.svg" alt=""></img>
                    </div>
                    <div>
                        <AddNotification onNewPeriodicNotificationAdd={onNewPeriodicNotificationAdd} />
                    </div>
                </div>


                <div className='justify-center items-center flex'>
                    <table className='shadow-md w-3/4 self-center my-2'>
                        <thead className='bg-gray-100 border-b-2'>
                            <tr>
                                <th className='p-3 text-sm font-quicksand whitespace-nowrap font-bold text-left w-16'>#</th>
                                <th className='p-3 text-sm font-quicksand whitespace-nowrap font-bold text-left'>Tasks</th>
                                <th className='p-3 text-sm font-quicksand whitespace-nowrap font-bold text-left w-24'>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listOfNotifications.length > 0 &&
                                listOfNotifications.map((item, index) => {
                                    return <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} items-center`}>
                                        <td className='p-3 text-sm font-quicksand whitespace-nowrap font-medium text-left w-16'>{index + 1}</td>
                                        <td className='p-3 text-sm font-quicksand whitespace-nowrap font-medium text-left'>{item.task_type}</td>
                                        <td className='p-3 text-sm font-quicksand whitespace-nowrap font-medium text-left w-24'>{formatTime(item.notification_time, "HH:mm A", "hh:mm a")}</td>
                                        <td className='m-3 flex-wrap justify-end flex cursor-pointer'> <svg xmlns="http://www.w3.org/2000/svg" className='self-center w-8' height="1em" viewBox="0 0 448 512" fill='#d24b45' onClick={() => onNotificationDelete(item)}><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" /></svg></td>
                                    </tr>
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const AddNotification = (props) => {
    const { onNewPeriodicNotificationAdd } = props
    const { work_id } = getWorkspaceInfo();
    const navigate = useNavigate();
    const { user_id } = getLoginDetails();
    const [listOfNotificationTypes, setNotificationTypes] = useState([])
    const [selectedNotificationType, selectNotificationType] = useState(null)
    const [timesList, setTimesList] = useState([{ time: "", hasInvalidTime: false }])

   
    const dispatch = Actions.getDispatch(React.useContext);

    const initial_data = {
        workspace_id: work_id,
        module_id: null,
        project_id: null,
        time_list: [],
        today: "False",
        notification_type_id: null
    }
    const [formData, setFormData] = React.useState({ ...initial_data, time_list: timesList })


    const [projectsResults, setProjectsResults] = React.useState([{ project_name: 'Select project' }]);
    const [moduleResults, setModuleResults] = React.useState([{ module_name: 'Select module' }]);


    const fetchNotificationTypes = async (w_id) => {
        let res = await apiAction({
            method: 'get',
            // navigate: navigate,
            // dispatch: dispatch,
            url: getTheNotificationTypesUrl(w_id),
        })
        if (res.success) {
            selectNotificationType(res.notification_type_list[0])
            setNotificationTypes(res.notification_type_list)
        }
    }

    const fetchProjects = async (id) => {
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

    useEffect(() => {
        fetchNotificationTypes(work_id)
        fetchProjects(work_id)
    }, [])

    React.useEffect(() => {
        if (work_id && formData.project_id) {
            getModuleResultsApi(work_id, formData.project_id)
        }
    }, [work_id, formData.project_id])

    let selectedProject = projectsResults.find((item) => item.project_id === formData.project_id);
    let selectedModule = moduleResults.find((item) => item.module_id === formData.module_id);
    // let selectedUser = employeeResults.find((item) => item.id === formData.employee_id);

    const hasValidTimes = () => {
        const emptyItemIndex = timesList.findIndex(item => item === "")
        if (emptyItemIndex > -1) {
            // timesList[emptyItemIndex].hasInvalidTime = true
            // setTimesList([...timesList])
            return false
        }
        return true
    }

    const getTimesData = () => {
        console.log("TIMES LIST", typeof (timesList.map(function (item) {
            return item['time'];
        })))
        return timesList.map(function (item) {
            return item['time'];
        });
    }


    const onAddClick = async () => {
        let validation_data = []
        let postBodyData = null
        let URL = ""
        if (selectedNotificationType.type_name === "Module Analytics") {
            postBodyData = { workspace_id: work_id, module_id: formData.module_id, project_id: formData.project_id, time_list: formData.time_list, today: "False" }
            URL = getTheModuleProgressPeriodicTasksUrl()
            validation_data = [
                { key: "workspace_id", message: 'Workspace field left empty!' },
                { key: "project_id", message: 'Please select project!' },
                { key: "module_id", message: "Please select module!" }
            ]
        } else {
            postBodyData = { workspace_id: work_id, time_list: formData.time_list, today: "False", notification_type_id: selectedNotificationType.type_id }
            URL = getThePeriodScheduleTask()
            validation_data = [
                { key: "workspace_id", message: 'Workspace field left empty!' },
                { key: "notification_type_id", message: "Please select notification type!" }
            ]
        }

        if (!hasValidTimes()) {
            notifyErrorMessage("Time field left empty!")
            return
        }
        const { isValid, message } = isFormValid(postBodyData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: 'post',
                // navigate: navigate,
                dispatch: dispatch,
                url: URL,
                data: postBodyData,
            })
            if (res.success) {
                onNewPeriodicNotificationAdd()
                notifySuccessMessage(res.status);
                setTimesList([""])
                setFormData({ ...initial_data })
            } else {
                notifyErrorMessage(res.detail)
            }
        } else {
            notifyErrorMessage(message)
        }
    }

    const onAddTimeItem = () => {
        timesList.push(null)
        setTimesList([...timesList])
    }

    const onRemoveTimeItem = (index) => {
        if (timesList.length === 1) {
            setTimesList([""])
        } else {
            timesList.splice(index, 1)
            setTimesList([...timesList])
        }
        setFormData({ ...formData, time_list: timesList })
    }

    const onTimeSet = (index, data) => {
        if (timesList[index]) {
            timesList[index] = data
        } else {
            timesList[index] = data
        }

        setTimesList([...timesList])
        setFormData({ ...formData, time_list: timesList })
    }
    console.log("DATA", formData.time_list)
    return (
        <div className="w-full mb-10 border-0 rounded-xl shadow-lg flex flex-col bg-white outline-none focus:outline-none">
            {/* header */}
            <form className="p-6 pt-0">
                <div className="text-center items-center p-5 border-b border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-2xl font-quicksand font-bold">{'Set Periodic Notification'}</h3>
                </div>

                {/* body */}
                <div className="relative p-6 flex-auto font-quicksand font-medium text-sm">
                    <div className="my-1 flex flex-col">
                        <CustomLabel label={`Select Notification Type`} className={'py-1'} />
                        <Dropdown options={listOfNotificationTypes} optionLabel="type_name" value={selectedNotificationType ? selectNotificationType : { type_name: 'Select Type' }} setValue={(value) => {
                            selectNotificationType({ ...value })
                        }
                        } />
                    </div>

                    {(selectedNotificationType != undefined) && (selectedNotificationType.type_name === "Module Analytics") &&
                        <div>
                            <div className="my-3 flex flex-col">
                                <CustomLabel label={`Select Project`} className={'py-1'} />
                                <Dropdown placeholder={true} options={projectsResults} optionLabel="project_name" value={selectedProject ? selectedProject : { project_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, project_id: value ? value.project_id : null }))} />
                            </div>

                            <div className="my-3 flex flex-col">
                                <CustomLabel label={`Select Module`} className={'py-1'} />
                                <Dropdown placeholder={true} options={moduleResults} optionLabel="module_name" value={selectedModule ? selectedModule : { module_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, module_id: value ? value.module_id : null }))} />
                            </div>
                        </div>
                    }
                    <CustomLabel label={`Select Time`} className={'py-1 mt-2'} />
                    {timesList.map((item, index) => {
                        return <div className='flex flex-col'>
                            <div className="my-3 flex flex-col">
                                <div className='flex flex-row space-x-1 w-full'>
                                    <IconInput
                                        inputType={"time"}
                                        disable={false}
                                        className={`w-full`}
                                        value={timesList[index] ? timesList[index] : ''}
                                        onTextChange={(e) => {
                                            console.log("TIME CHANGE", e.target.value)
                                            onTimeSet(index, e.target.value)
                                        }}
                                        onBlurEvent={() => { }}
                                        placeholder={""}
                                        isRightIcon={true}
                                    >
                                    </IconInput>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='self-center w-8' height="1em" viewBox="0 0 448 512" fill='#d24b45' onClick={() => { onRemoveTimeItem(index, item) }}><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" /></svg>
                                </div>
                            </div>

                        </div>
                    })}

                    <div className='flex justify-end'>
                        <div className='flex border-dashed border-[2px] bg-white hover:bg-gray-100 py-2 px-4 mt-4 !outline-none font-quicksand font-semibold text-sm justify-center items-center' onClick={() => { onAddTimeItem() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className='mr-2' height="1em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
                            <span>Add Time</span>
                        </div>
                    </div>


                </div>

                {/* footer */}
                <div className="p-6 border-t border-solid border-slate-200 rounded-b">
                    <PlainButton title={"Add"} className={"w-full"} onButtonClick={onAddClick} disable={false}></PlainButton>
                </div>
            </form>
        </div>
    )
}