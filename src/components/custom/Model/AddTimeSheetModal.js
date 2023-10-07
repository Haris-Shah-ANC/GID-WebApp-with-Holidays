import React from 'react';
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
    getWorkspaceInfo,
} from '../../../config/cookiesInfo';

import {
    post_task,
    update_task,
    get_all_project,
    get_project_module,
} from '../../../api/urls';
import PlainButton from '../../custom/Elements/buttons/PlainButton';
import GidInput from '../../custom/Elements/inputs/GidInput';
import GIDTextArea from '../../custom/Elements/inputs/GIDTextArea';
import IconInput from '../../custom/Elements/inputs/IconInput';

const AddTimeSheetModal = (props) => {
    const { setShowModal, data, from } = props;
    const { work_id } = getWorkspaceInfo();
    const navigate = useNavigate();
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
        assignee_id: data ? data.assignee_id : null
    }
    const [formData, setFormData] = React.useState({ ...initial_data })
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
    React.useEffect(() => {
        if (work_id && formData.project_id) {
            getModuleResultsApi(work_id, formData.project_id)
        }
    }, [work_id, formData.project_id])

    React.useEffect(() => {
        if (work_id) {
            getProjectsResultsApi(work_id);
        }

    }, [work_id])

    let selectedProject = projectsResults.find((item) => item.project_id === formData.project_id);
    let selectedModule = moduleResults.find((item) => item.module_id === formData.module_id);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
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
            let res = await apiAction({
                method: 'post',
                navigate: navigate,
                dispatch: dispatch,
                url: formData.task_id ? update_task() : post_task(),
                data: { ...formData, dead_line: formattedDeadline(formData.dead_line) },
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
    let sampleData = [{ date: "12/12/2023", working_hr: "7" }]
    return (

        // <div className="relative my-6 w-full mx-2 sm:max-w-sm md:max-w-md overflow-y-auto overflow-x-auto">
        //     <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
        <>
                {/* header */}
                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">Add Efforts</h3>
                    <button
                        className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                        onClick={() => setShowModal(false)}>
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                <form>

                    <div className="relative px-5 pt-2 flex-auto ">
                        <table className=" bg-transparent border-collapse table-auto w-full rounded-lg">
                            <thead className='bg-gray-200 px-10 justify-center items-center'>
                                <tr className='justify-center h-10'>
                                    <th
                                        key={"valid_from"}
                                        className={`text-sm pl-2 text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                        Date
                                    </th>
                                    <th
                                        key={"valid_upto"}
                                        className={`text-sm  text-center text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                        {'Duration (Hr)'}
                                    </th>
                                    <th
                                        key={"valid_upto"}
                                        className={`text-sm pr-2 text-right text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                                        Action
                                    </th>

                                </tr>
                            </thead>
                            <tbody className=" divide-y divide-gray-200 table-fixed">
                                {sampleData.map((item, index) => (
                                    <tr key={index} className={`bg-white `} onClick={() => { }}>
                                        <td className="pl-2">
                                            <p className='text-md text-left font-quicksand'>
                                                {item.date}
                                            </p>
                                        </td>
                                        <td className="py-4">
                                            <p className=' text-center text-md font-quicksand'>
                                                {item.working_hr}
                                            </p>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        <div className="my-4 flex flex-col">
                            <IconInput
                                id={"task_end_datetime"}
                                inputType={"date"}
                                disable={false}
                                className={``}
                                value={formData.dead_line ? formData.dead_line : ""}
                                onTextChange={(e) => setFormData((previous) => ({ ...previous, dead_line: e.target.value }))}
                                onBlurEvent={() => { }}
                                placeholder={""}
                                isRightIcon={true}
                            >
                            </IconInput>
                        </div>


                    </div>


                    <div className="p-6 border-solid border-slate-200 rounded-b">
                        <PlainButton title={"Save Changes"} className={"w-full"} onButtonClick={handleSaveChanges} disable={false}></PlainButton>
                    </div>
                </form>

        </>
        //     </div>
        // </div>
    )
}

export default AddTimeSheetModal;
