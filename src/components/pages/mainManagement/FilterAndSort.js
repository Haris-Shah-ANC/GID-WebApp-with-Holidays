import React, { useState } from 'react';
import moment from 'moment';
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
    employee,
} from '../../../api/urls';

const FilterAndSort = (props) => {
    const { setShowModal, data,onFilterApply,onFilterClear } = props;
    const { work_id } = getWorkspaceInfo();

    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);

    const initial_data = {
        employee_id: data.employee_id,
        module_id: data ? data.module_id : null,
        project_id: data ? data.project_id : null,
    }
    const [formData, setFormData] = React.useState(initial_data)
    const [employeeList, setEmployeeList] = useState([])

    const [projectsResults, setProjectsResults] = React.useState([{ project_name: 'Select project' }]);
    const [moduleResults, setModuleResults] = React.useState([{ module_name: 'Select module' }]);
    let selectedProject = projectsResults.find((item) => item.project_id === formData.project_id);
    let selectedModule = moduleResults.find((item) => item.module_id === formData.module_id);
    let selectedEmployee = employeeList.find((item) => item.id === formData.employee_id);

    React.useEffect(() => {
        if (work_id && formData.project_id) {
            getModuleResultsApi(work_id, formData.project_id)
        }
    }, [work_id, formData.project_id])

    React.useEffect(() => {
        if (work_id) {
            getProjectsResultsApi(work_id);
            getEmployeeList()
        }

    }, [work_id])

    const getEmployeeList = async () => {
        let res = await apiAction({ url: employee(work_id), method: 'get', navigate: navigate, dispatch: dispatch })
        if(res){
            if (res.success) {
                setEmployeeList([{ employee_name: 'Select employee' }, ...res.results])
            }
        }
    }
    const getProjectsResultsApi = async (id) => {
        let res = await apiAction({ method: 'get', navigate: navigate, dispatch: dispatch, url: get_all_project(id), })
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
    const onProjectSelect = (item) => {
        setModuleResults([{ module_name: 'Select module' }])
        setFormData((previous) => ({ ...previous, project_id: item ? item.project_id : null }))
        if (item.id) {
            getModuleResultsApi(work_id, item.id)
        }
    }
    const handleStatusChanges = (value) => {
        if (formData.status.includes(value, 0)) {
            let index = formData.status.indexOf(value)
            formData.status.splice(index, 1)
        } else {
            formData.status.push(value)
        }
        setFormData({ ...formData })
    }
    const onEmployeeChange = (item) => {
        setFormData((previous) => ({ ...previous, employee_id: item ? item.id : null }))
    }
    const onModuleChange = (item) => {
        setFormData((previous) => ({ ...previous, module_id: item ? item.module_id : null }))
    }

    const handleSaveChanges = async (e) => {
        onFilterApply(formData)
        setShowModal(false)
    };
    const handleClearBtn = () => {
        setFormData({
            employee_id: [],
            module_id: [],
            project_id: null,
        })
        onFilterClear()
        setShowModal(false)
    }

    return (
        <div className="relative my-6 md:w-2/4 w-full mx-2 sm:max-w-sm md:max-w-md overflow-x-auto">
            <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Filter'}</h3>
                    <button
                        className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                        onClick={() => setShowModal(false)}>
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
                <form>

                    <div className="relative px-5 pt-2 flex-auto">
                        {/* <div className="my-1 flex flex-col">
                            <CustomLabel label={`User`} className={'font-quicksand font-semibold text-sm mb-1'} />
                            <Dropdown disabled={false} placeholder={true} options={employeeList} optionLabel={'employee_name'} value={selectedEmployee ? selectedEmployee :{ employee_name: 'Select employee' }} setValue={(value) => onEmployeeChange(value)} />
                        </div> */}
                        <div className="my-1 flex flex-col my-6">
                            <CustomLabel label={`Project`} className={'font-quicksand font-semibold text-sm mb-1'} />
                            <Dropdown disabled={false} placeholder={true} options={projectsResults} optionLabel={'project_name'} value={selectedProject ? selectedProject : { project_name: 'Select project' }} setValue={(value) => onProjectSelect(value)} />
                        </div>
                        {/* {
                            <div className="my-4 flex flex-col">
                                <CustomLabel label={`Module`} className={'font-quicksand font-semibold text-sm mb-1'} />
                                <Dropdown placeholder={true} disabled={moduleResults.length <= 1} options={moduleResults} optionLabel={'module_name'} value={selectedModule ? selectedModule : { module_name: 'Select module' }} setValue={(value) => onModuleChange(value)} />
                            </div>
                        } */}

                    </div>

                    <div className="p-6 border-solid border-slate-200 rounded-b flex flex-row mt-6">
                        <button
                            type="button"
                            onClick={handleClearBtn}
                            className="text-blue-500 mr-6 border-blue-500 border     font-bold text-sm w-full py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveChanges}
                            className="bg-blue-500 text-white ml-6 active:bg-blue-600 font-bold text-sm w-full py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                        >
                            Apply
                        </button>

                    </div>
                </form>


            </div>
        </div>
    )
}

export default FilterAndSort;
