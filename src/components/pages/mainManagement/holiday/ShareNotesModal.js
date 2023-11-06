import React, { useContext, useEffect, useState } from 'react'
import PlainButton from '../../../custom/Elements/buttons/PlainButton'
import ButtonWithImage from '../../../custom/Elements/buttons/ButtonWithImage'
import CustomLabel from '../../../custom/Elements/CustomLabel'
import { apiAction } from '../../../../api/api'
import { employee } from '../../../../api/urls'
import { useNavigate } from 'react-router-dom'
import { getLoginDetails, getWorkspaceInfo } from '../../../../config/cookiesInfo'
import * as Actions from '../../../../state/Actions';
import Dropdown from '../../../custom/Dropdown/Dropdown'
import RadioButton from '../../../custom/Elements/RadioButton'
import { Autocomplete, TextField } from '@mui/material'
import MultiSelectAutoCompleteDropdown from '../../../custom/Dropdown/MultiSelectAutoCompleteDropdown'

export default function ShareNotesModal(props) {

    const { setShowModal, onSuccess, } = props
    const { work_id } = getWorkspaceInfo();
    const navigate = useNavigate();
    const loginDetails = getLoginDetails();
    const user_id = loginDetails.user_id
    const dispatch = Actions.getDispatch(useContext);
    const [employeeList, setEmployeeList] = useState([]);
    const [formData, setFormData] = useState({ workspace: work_id, employee: null, access: 'Read Only' })

    useEffect(() => {
        getEmployeeList()
    }, [])
    const selectedEmployee = formData.employee ? employeeList.find((item) => item.id == employee) : null
    const handleSubmit = () => {

        setShowModal(false);
    };

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
                    setEmployeeList(employeeData.sort((a, b) => -b['employee_name'].localeCompare(a['employee_name'])))
                }
            })
            .then((error) => {
                console.log("ERROR", error)
            })
    }
    const onSelectChange = (empList) => {

    }

    return (
        <div>
            <div>
                {/* header */}
                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Share note'}</h3>
                    <ButtonWithImage
                        onButtonClick={() => { setShowModal(false) }}
                        title={""}
                        className={"rounded-full w-10 h-10 p-0 m-0 justify-center items-center bg-white shadow-none hover:bg-gray-200 active:bg-gray-200"}
                        icon={<i className="fa-solid fa-times text text-black self-center" color='black'></i>}
                    ></ButtonWithImage>
                </div>
                <form>

                    <div className="relative px-5 pt-2 flex-auto">
                        <div className="mt-4 my-1 flex flex-col">
                            <CustomLabel label={`Share with`} className={'font-quicksand font-semibold text-sm mb-1'} />
                            <MultiSelectAutoCompleteDropdown arrayList={employeeList} labelKey={"employee_name"} onChange={onSelectChange} />
                        </div>
                        <div className='mt-4'>
                            <CustomLabel label={`Access`} className={'font-quicksand font-semibold text-sm mb-1'} />
                            <div class="flex flex-row items-center mb-4 mt-2">
                                <RadioButton title={"Read Only"} checked={formData.access} onChange={(val) => setFormData({ ...formData, access: val })} disable={false} />
                                <RadioButton className={'ml-5'} title={"Write"} checked={formData.access} onChange={(val) => setFormData({ ...formData, access: val })} disable={false} />
                                <RadioButton className={'ml-5'} title={"Both"} checked={formData.access} onChange={(val) => setFormData({ ...formData, access: val })} disable={false} />
                            </div>

                        </div>

                        <div className="my-4 flex flex-col">
                            {/* <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Link"}/> */}
                        </div>

                    </div>

                    <div className="p-6 border-solid border-slate-200 rounded-b">
                        <PlainButton
                            title={"Share"}
                            className={"w-full"}
                            onButtonClick={handleSubmit}
                            disable={false}>
                        </PlainButton>
                    </div>

                </form>
            </div>
        </div>

    )
}
