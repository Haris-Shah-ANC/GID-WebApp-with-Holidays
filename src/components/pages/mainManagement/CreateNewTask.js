import React, { useState } from 'react';
import { apiAction } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import * as Actions from '../../../state/Actions';
import Checkbox from '../../custom/Elements/buttons/Checkbox';
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
    getLoginDetails,
    getWorkspaceInfo,
} from '../../../config/cookiesInfo';

import {
    post_task,
    update_task,
    get_all_project,
    get_project_module,
    employee,
} from '../../../api/urls';
import PlainButton from '../../custom/Elements/buttons/PlainButton';
import GidInput from '../../custom/Elements/inputs/GidInput';
import GIDTextArea from '../../custom/Elements/inputs/GIDTextArea';
import IconInput from '../../custom/Elements/inputs/IconInput';
import EffortsComponent from '../../custom/EffortsComponent';
import moment from 'moment';
import CustomDatePicker from '../../custom/Elements/CustomDatePicker';
import CustomDateTimePicker from '../../custom/Elements/CustomDateTimePicker';
import dayjs from 'dayjs';

const CreateNewTask = (props) => {
    const { setShowModal, data, from } = props;
    const { work_id } = getWorkspaceInfo();
    const navigate = useNavigate();
    const loginDetails = getLoginDetails();
    const user_id = loginDetails.user_id
    const dispatch = Actions.getDispatch(React.useContext);
    const initial_data = {
        work_id: work_id,
        task: data ? data.task : null,
        task_id: data ? data.task_id : null,
        module_id: data ? data.module_id : null,
        dead_line: data ? data.dead_line : null,
        project_id: data ? data.project_id : null,
        on_hold_reason: data ? data.on_hold_reason : null,
        status: data ? data.status : 'In-Progress',
        detailed_description: data ? data.detailed_description : null,
        description_link: data ? data.description_link : null,
        assign_to_id: data ? data.assignee_id : null,
        employee: data ? data.employee : null
    }
    const [formData, setFormData] = React.useState({ ...initial_data })
    const [projectsResults, setProjectsResults] = React.useState([{ project_name: 'Select project' }]);
    const [moduleResults, setModuleResults] = React.useState([{ module_name: 'Select module' }]);
    const [employeeList, setEmployeeList] = React.useState([{ employee_name: 'Self' }]);
    const [isEffortsTableVisible, setEffortsTableVisible] = useState(false)
    const [updateEffortsStatus, setUpdateEffortsStatus] = useState(false)
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
    const getEmployeeList = async () => {
        let res = await apiAction({
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
            url: employee(work_id),
        })
        if (res.success) {
            let employeeData = res.results
            for (let index in employeeData) {
                if (employeeData[index].id == user_id) {
                    employeeData.splice(index, 1)
                }
            }
            setEmployeeList([{ employee_name: "Self" }, ...employeeData])
        }
    }
    React.useEffect(() => {
        if (formData.project_id) {
            getModuleResultsApi(work_id, formData.project_id)
        }
    }, [work_id, formData.project_id])

    React.useEffect(() => {
        if (work_id) {
            getProjectsResultsApi(work_id);
            getEmployeeList()
        }

    }, [work_id])

    let selectedProject = projectsResults.find((item) => item.project_id === formData.project_id);
    let selectedModule = moduleResults.find((item) => item.module_id === formData.module_id);
    let selectedAssignee = employeeList.find((item) => item.id === formData.assign_to_id);

    const updateOrAddTask = async () => {

        let validation_data = [
            { key: "project_id", message: 'Please select the project!' },
            { key: "task", message: `Description field left empty!` },
            { key: "dead_line", message: 'Deadline field left empty!' },
        ]
        if (formData.status === "On Hold") {
            validation_data.push({ key: "on_hold_reason", message: 'Please enter reason!' },)
        }
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            console.log("FORM DATA", formData)
            let postData = formData
            if (!postData.assign_to_id) {
                delete postData['assign_to_id']
            }
            let res = await apiAction({
                method: 'post',
                navigate: navigate,
                dispatch: dispatch,
                url: formData.task_id ? update_task() : post_task(),
                data: { ...postData, dead_line: formattedDeadline(postData.dead_line) },
            })
            if (res.success) {
                setShowModal(false);
                notifySuccessMessage(res.status);
                if (from === "calender_view") {
                    navigate(routesName.calendar.path)
                } else if (from === "dashboard") {
                    navigate(routesName.dashboard.path)
                }
            } else {
                notifyErrorMessage(res.status)
            }
        } else {
            notifyErrorMessage(message)
        }
    };
    const onSaveChangesBtnClick = (e) => {
        e.preventDefault();
        if (formData.task_id && isEffortsTableVisible) {
            setUpdateEffortsStatus(true)
        } else {
            updateOrAddTask()
        }
    }
    const onEffortsAddedSuccess = () => {
        setUpdateEffortsStatus(false)
        updateOrAddTask()
        console.log("ON EFFORTS CREATED SUCCESSFULLY")
    }

    const onLinkTextClick = (btnTitle) => {
        const tomorrow = moment().add(1, 'days');
        const today = moment()
        let tomorrowDate = tomorrow.format('YYYY-MM-DD') + "T20:00"
        let todayDate = today.format('YYYY-MM-DD') + "T20:00"
        if (btnTitle === "Today") {
            setFormData((previous) => ({ ...previous, dead_line: todayDate }))
        } else {
            setFormData((previous) => ({ ...previous, dead_line: tomorrowDate }))
        }
    }

    return (

        // <div className="justify-center overflow-hidden  items-center flex fixed overflow-x-hidden  fixed inset-0 z-50 outline-none focus:outline-none">
        //     <div className=" sm:w-[65vh] h-[80vh] overflow-hidden border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
        //         <div className="flex items-center flex-row h-14  justify-between  border-solid border-slate-200 rounded-t text-black">
        //             <h3 className="text-lg font-quicksand font-bold text-center w-full">{formData.task_id ? 'Update Task' : 'Add Task'}</h3>
        //             <button
        //                 className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
        //                 onClick={() => setShowModal(false)}>
        //                 <i className="fa-solid fa-times"></i>
        //             </button>
        //         </div>
        <>
            <div className="flex items-center flex-row h-14  justify-between  border-solid border-slate-200 rounded-t text-black">
                <h3 className="text-lg font-quicksand font-bold text-center w-full">{formData.task_id ? 'Update Task' : 'Add Task'}</h3>
                <button
                    className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                    onClick={() => setShowModal(false)}>
                    <i className="fa-solid fa-times"></i>
                </button>
            </div>
            <form id={"last_div"} className='overflow-auto relative     ' style={{ height: 'calc(100vh - 180px)', }} >

                <div className="relative mt-2  flex-auto p-4" >
                    <div className="my-1 flex flex-col">
                        <CustomLabel label={`Select  Project`} className={'font-quicksand font-semibold text-sm mb-1'} />
                        <Dropdown disabled={formData.task_id ? true : false} placeholder={true} options={projectsResults} optionLabel={'project_name'} value={selectedProject ? selectedProject : { project_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, project_id: value ? value.project_id : null }))} />
                    </div>
                    {!formData.task_id &&
                        <div className="mt-4 my-1 flex flex-col">
                            <CustomLabel label={`Assign To`} className={'font-quicksand font-semibold text-sm mb-1'} />
                            <Dropdown disabled={false} placeholder={true} options={employeeList} optionLabel={'employee_name'} value={selectedAssignee ? selectedAssignee : { employee_name: 'Self' }} setValue={(value) => setFormData((previous) => ({ ...previous, assign_to_id: value ? value.id : null }))} />
                        </div>
                    }
                    {
                        !formData.task_id &&
                        <div className="my-4 flex flex-col">
                            <CustomLabel label={`Select Module`} className={'font-quicksand font-semibold text-sm mb-1'} />
                            <Dropdown placeholder={true} options={moduleResults} optionLabel={'module_name'} value={selectedModule ? selectedModule : { module_name: 'Select project' }} setValue={(value) => setFormData((previous) => ({ ...previous, module_id: value ? value.module_id : null }))} />
                        </div>
                    }


                    <div className="mt-4 flex flex-col">
                        <CustomLabel label={`Task Description`} className={'font-quicksand font-semibold text-sm mb-1'} />
                        <GIDTextArea
                            id={"task_description"} disable={false} className={"h-20"} value={formData.task}
                            onBlurEvent={() => { }}
                            placeholderMsg={"Add the task description"}
                            onTextChange={(event) => { setFormData({ ...formData, task: event.target.value }) }}>
                        </GIDTextArea>
                    </div>
                    <div className="mt-4 flex flex-col">
                        <CustomLabel label={`Detailed Description`} className={'font-quicksand font-semibold text-sm mb-1'} />
                        <GIDTextArea
                            id={"task_detailed_description"} disable={false} className={"h-20"} value={formData.detailed_description}
                            onBlurEvent={() => { }}
                            placeholderMsg={"Add the detailed task description"}
                            onTextChange={(event) => setFormData((previous) => ({ ...previous, detailed_description: event.target.value }))}>
                        </GIDTextArea>
                    </div>

                    <div className="mt-4 flex flex-col">
                        <CustomLabel label={`Description Link`} className={'font-quicksand font-semibold text-sm mb-1'} />
                        <GidInput
                            inputType={"text"}
                            id='link_description'
                            disable={false}
                            placeholderMsg={"Enter link"}
                            className={""}
                            value={formData.description_link ? formData.description_link : ''}
                            onBlurEvent={() => { }}
                            onTextChange={(e) => {
                                setFormData((previous) => ({ ...previous, description_link: e.target.value }))
                            }}></GidInput>
                    </div>

                    <CustomLabel label={`Status`} className={'font-quicksand text-sm flex mt-2 mb-1'} />
                    <div className='grid grid-cols-2 gap-2 font-quicksand font-semibold text-sm'>
                        <Checkbox
                            value="In-Progress"
                            checked={formData.status === 'In-Progress'}
                            label={'In Progress'}
                            onChange={(e) => setFormData((previous) => ({ ...previous, status: e.target.value }))}
                        />
                        <Checkbox
                            value="Pending"
                            checked={formData.status === 'Pending'}
                            label={'Pending'}
                            onChange={(e) => setFormData((previous) => ({ ...previous, status: e.target.value }))}
                        />
                        {
                            formData.task_id &&
                            <Checkbox
                                value="Completed"
                                checked={formData.status === 'Completed'}
                                label={'Completed'}
                                onChange={(e) => setFormData((previous) => ({ ...previous, status: e.target.value }))}
                            />
                        }
                        {data && data.task ?
                            <Checkbox
                                value="On Hold"
                                checked={formData.status === 'On Hold'}
                                label={'On Hold'}
                                onChange={(e) => setFormData((previous) => ({ ...previous, status: e.target.value }))}
                            />
                            : null}
                    </div>

                    {formData.status === "On Hold" &&
                        <div className="mt-4 flex flex-col">
                            <CustomLabel label={`Reason`} className={'font-quicksand font-semibold text-sm'} />

                            <GIDTextArea
                                id={"on_hold_reason_text_input"} disable={false} className={"h-20"} value={formData.on_hold_reason}
                                onBlurEvent={() => { }}
                                placeholderMsg={"Add the task on hold reason"}
                                onTextChange={(e) => setFormData((previous) => ({ ...previous, on_hold_reason: e.target.value }))}>
                            </GIDTextArea>
                        </div>
                    }

                    <div className="my-4 flex flex-col">
                        <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={<span><i className="fa-solid fa-calendar-days text-base mb-1 mr-1"></i>Deadline</span>} />
                        <CustomDateTimePicker
                            id={"task_end_datetime"}
                            inputType={"datetime-local"}
                            disable={false}
                            className={`w-full`}
                            value={formData.dead_line ? formData.dead_line : ""}
                            onDateChange={(val) => {
                                setFormData((previous) => ({ ...previous, dead_line: dayjs(val).toJSON() }))
                            }}
                            onBlurEvent={() => { }}
                            placeholder={""}
                            isRightIcon={true}
                        >
                        </CustomDateTimePicker>
                        { }
                        <div className='flex flex-row'>
                            <LinkText title={"Today"} onClick={onLinkTextClick}></LinkText>
                            <LinkText title={"Tomorrow"} onClick={onLinkTextClick}></LinkText>

                        </div>

                    </div>

                    {formData.task_id &&
                        <>
                            <div className='px-1 flex flex-row items-center justify-between my-5 text-sm font-medium font-quicksand text-gray-800 hover:bg-blue-50 cursor-pointer'
                                onClick={() => {
                                    const element = document.getElementById("last_div");
                                    element.scrollTop = element.scrollHeight;
                                    setEffortsTableVisible(!isEffortsTableVisible)
                                }}>
                                <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={<span>Efforts</span>} />

                                {isEffortsTableVisible ?
                                    <i class="fa-solid fa-chevron-up" style={{ color: "#1463eb" }}></i>
                                    :
                                    <i class="fa-solid fa-chevron-down" style={{ color: "#1463eb" }}></i>
                                }
                            </div>
                            <EffortsComponent data={initial_data} isVisible={isEffortsTableVisible} onEffortsAddedSuccess={onEffortsAddedSuccess} updateEffortsStatus={updateEffortsStatus} setUpdateEffortsStatus={setUpdateEffortsStatus} />
                        </>
                    }

                </div>

                <div className='m-4'>
                    <PlainButton title={"Save Changes"} className={"w-full  "} onButtonClick={onSaveChangesBtnClick} disable={formData.task_id ? user_id == formData.employee ? false : true : false}></PlainButton>
                </div>
            </form>
            {/* <div className="p-6 border-solid border-slate-200 rounded-b">
                <PlainButton title={"Save Changes"} className={"w-full"} onButtonClick={onSaveChangesBtnClick} disable={formData.task_id ? user_id == formData.employee ? false : true : false}></PlainButton>
            </div> */}

        </>

        //     </div>
        // </div>
    )
}

const LinkText = ({ title, onClick }) => {
    return (
        <p className='pr-4 text-blue-700 text-sm font-quicksand pt-1 cursor-pointer' onClick={() => onClick(title)}>{title}</p>
    )
}

export default CreateNewTask;
