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
    formatDate,
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
    getTheListOfTaskEffortsUrl,
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
import { LinkedText } from '../../custom/Elements/buttons/LinkedText';
import ToggleSlider from '../../custom/Elements/ToggleSlider';
import { twMerge } from 'tailwind-merge';
import { DateFormatCard } from '../../../utils/Constant';
import { Divider } from '@mui/material';

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
    const [isEditAction, setEditAction] = useState(!formData.task_id)
    const [listOfEfforts, setListOfEfforts] = useState([])
    const [totalEfforts, setTotalEfforts] = useState(null)
    const [isNetworkCallRunning, setNetworkCallStatus] = useState(false)

    const getProjectsResultsApi = async (id) => {
        let res = await apiAction({
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
            url: get_all_project(id),
        })
            .then((response) => {
                if (response.success) {
                    setProjectsResults([{ project_name: 'Select project' }, ...response.result])
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }
    const getModuleResultsApi = async (w_id, p_id) => {
        let res = await apiAction({
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
            url: get_project_module(w_id, p_id),
        })
            .then((response) => {
                if (response.success) {
                    setModuleResults([{ module_name: 'Select module' }, ...response.project_module_list])
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })

    }
    const getEmployeeList = async () => {
        let res = await apiAction({
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
            url: employee(work_id),
        })
            .then((response) => {
                if (response.success) {
                    let employeeData = response.results
                    for (let index in employeeData) {
                        if (employeeData[index].id == user_id) {
                            employeeData.splice(index, 1)
                        }
                    }
                    setEmployeeList([{ employee_name: "Self" }, ...employeeData])
                }
            })
            .then((error) => {
                console.log("ERROR", error)
            })

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
        if (!isEditAction) {
            getEmployeeTaskEfforts()
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

    const getEmployeeTaskEfforts = async () => {
        setNetworkCallStatus(true)
        let res = await apiAction({ url: getTheListOfTaskEffortsUrl(work_id, data.task_id ? data.task_id : data.id), method: 'get', data: {}, navigate: navigate, dispatch: dispatch })
            .then((response) => {
                setNetworkCallStatus(false)
                if (response) {
                    let listOfEfforts = response.result.list_task_record
                    setTotalEfforts(parseFloat(response.result.total_task_duration).toFixed(2))
                    setListOfEfforts(listOfEfforts)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

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
    const Linkify = ({ children }) => {
        const isUrl = word => {
            const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
            return word.match(urlPattern)
        }

        const addMarkup = word => {
            return isUrl(word) ?
                `<a target="blank" class="text-blue-700 font-medium text-sm" href="${word}">${word}</a>` :
                word
        }
        const words = children.split(' ')
        const formatedWords = words.map((w, i) => addMarkup(w))
        const html = formatedWords.join(' ')
        return (
            <p className="flex w-[88%] font-bold text-md overflow-hidden break-all font-quicksand" dangerouslySetInnerHTML={{ __html: html }}></p>
        )
    }

    return (
        <>
            <div className="flex items-center flex-row h-14  justify-between  border-solid border-slate-200 rounded-t text-black">
                <h3 className={`text-lg font-quicksand font-bold text-center w-full`}>{!isEditAction ? "Task Details" : formData.task_id ? 'Update Task' : 'Add Task'}</h3>

                <div className={`absolute flex justify-end right-[0px] pr-3 ${formData.task_id ? "" : "hidden"}`}>
                    <ToggleSlider isChecked={isEditAction} handleChange={(val) => setEditAction(val)} />
                </div>
            </div>

            <form id={"last_div"} className='overflow-auto relative' style={{ height: 'calc(100vh - 180px)', }} >

                {/* READ ONLY VIEW */}

                <div className={`relative mt-4 p-4 ${isEditAction ? "hidden" : ""}`} >
                    <span className="text-lg font-bold font-quicksand align-middle ">
                        {formData.task}</span>

                    {formData.detailed_description &&
                        <div className='flex-flex-col w-full mt-3'>
                            <span className="text-sm font-quicksand font-medium inline-block pb-1 text-blueGray-600 last:mr-0 mr-1 truncate text-ellipsis w-full">
                                {formData.detailed_description}
                            </span>
                        </div>
                    }
                    <div className='mt-6 flex flex-row items-center'>
                        <LabelText label={"Project"} className={"w-1/4"} />
                        <span className="text-xs  font-semibold font-quicksand inline-block py-1 align-middle px-2 rounded-full border border-black">
                            {selectedProject && selectedProject.project_name}</span>
                    </div>


                    {selectedModule &&
                        <div className='mt-4 flex flex-row items-center'>
                            <LabelText label={"Module"} className={"w-1/4"} />
                            <span className="text-xs  font-semibold font-quicksand inline-block py-1 align-middle px-2 rounded-full border border-black">
                                {selectedModule.module_name}</span>
                            <br />
                        </div>
                    }

                    {formData.description_link &&
                        <div className={`align-top font-quicksand flex flex-row w-full mt-6 `} >
                            <LabelText label={"Description link"} className={""} />
                            <Linkify>
                                {formData.description_link}
                            </Linkify>

                        </div>
                    }

                    <div className={` flex flex-row items-center w-full mt-6 `} >
                        <LabelText label={"Status"} className={"w-1/4"} />
                        <span className="text-xs font-semibold font-quicksand inline-block py-1 align-middle px-2 rounded-full border border-black">{formData.status}</span>
                        {/* //////////////////////////// */}
                        {formData.status === "In-Progress" &&
                            <h3 className='mx-3 text-blue-400 font-semibold text-xs hover:underline cursor-pointer'
                                onClick={(e) => {
                                    //  setFormData((previous) => ({ ...previous, status: "Completed"}));
                                    formData.status = "Completed"
                                    setFormData({ ...formData })
                                    onSaveChangesBtnClick(e);
                                }}
                            >Mark as Completed</h3>
                        }
                    </div>

                    {formData.on_hold_reason &&
                        <div className={` flex flex-row  mt-6`} >
                            <LabelText label={"Reason"} className={"w-[30%] mt-1 "} />
                            <ValueText value={formData.on_hold_reason} className={'w-[89%]'} />
                        </div>
                    }
                    <div className='flex flex-row items-center mt-6'>
                        <LabelText label={"Created at"} className={""} />
                        <ValueText value={data && moment(data.created_at).format(DateFormatCard)} />
                    </div>
                    <div className='flex flex-row items-center mt-6'>
                        <LabelText label={"Due Date"} className={""} />
                        <ValueText value={moment(formData.dead_line).format(DateFormatCard)} />
                    </div>


                    <Divider className='py-4' />
                    <div className=''>
                        <LabelText label={"Efforts"} className={"mt-6"} />
                        <div className={`relative flex-col flex justify-center ${listOfEfforts.length <= 0 ? "hidden" : ""} mt-2`}>
                            <table className=" bg-transparent border-collapse table-auto rounded-lg ">
                                <thead className='bg-gray-200 justify-center items-center'>
                                    <tr className='justify-center h-5'>
                                        <th
                                            key={"valid_from"}
                                            className={`text-sm pl-3 text-left text-blueGray-500 font-interVar w-1/2 font-quicksand font-medium`}>
                                            Date
                                        </th>
                                        <th
                                            key={"valid_upto"}
                                            className={`text-sm  text-center text-blueGray-500 font-interVar w-1/2 font-quicksand font-medium`}>
                                            {'Duration (Hr)'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className=" divide-y divide-gray-200 table-fixed">
                                    {listOfEfforts.map((item, index) => (
                                        <tr key={index} className={`bg-white `} onClick={() => { }}>
                                            <td className="pl-3">
                                                <p className=' text-left text-sm font-quicksand'>
                                                    {formatDate(item.working_date, "DD/MM/YYYY")}
                                                </p>
                                            </td>

                                            <td className="py-4 ">
                                                <p className=' text-center text-sm font-quicksand'>
                                                    {item.working_duration}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}

                                    <tr className="bg-gray-200">
                                        <td className="text-sm font-quicksand pl-3 font-medium">
                                            Total
                                        </td>
                                        <td className="text-sm font-quicksand font-medium" align="center">
                                            {listOfEfforts.length > 0 ? totalEfforts : "0.00"} Hrs
                                        </td>
                                        <td>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        {listOfEfforts.length == 0 && !isNetworkCallRunning ?
                            <div className='flex justify-center mt-6'>
                                <LabelText label={"No efforts added."} />
                            </div>
                            : null}
                    </div>


                </div>


                {/* EDIT OR CREATE VIEW */}
                <div className={`relative mt-2  flex-auto p-4 ${isEditAction ? "" : "hidden"}`} >
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
                            <LinkedText title={"Today"} onClick={onLinkTextClick}></LinkedText>
                            <LinkedText title={"Tomorrow"} onClick={onLinkTextClick}></LinkedText>

                        </div>

                    </div>

                    {formData.task_id &&
                        <>
                            <div className='px-1 flex flex-row items-center justify-between my-5 text-sm font-medium font-quicksand text-gray-800 hover:bg-blue-50 cursor-pointer'
                                onClick={() => {
                                    // const element = document.getElementById("last_div");
                                    // element.scrollTop = element.scrollHeight;
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

                <div className={`m-4 ${isEditAction ? "" : "hidden"}`}>
                    <PlainButton title={"Save Changes"} className={"w-full"} onButtonClick={onSaveChangesBtnClick} disable={formData.task_id ? user_id == formData.employee ? false : true : false}>
                    </PlainButton>
                </div>
            </form>
        </>
    )
}

function LabelText(props) {
    const { label, className } = props
    const tailwindMergedCSS = twMerge(` font-quicksand text-sm font-normal  w-[30%] flex`, className)

    return (
        <span className={tailwindMergedCSS}>{label}</span>
    )
}
function ValueText(props) {
    const { value, className } = props
    const tailwindMergedCSS = twMerge('font-quicksand text-sm font-medium w-[88%]', className)

    return (
        <span className={tailwindMergedCSS}>{value}</span>
    )
}

export default CreateNewTask;
