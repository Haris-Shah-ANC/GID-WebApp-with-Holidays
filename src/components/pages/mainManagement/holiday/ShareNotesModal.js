import React, { useContext, useEffect, useState } from 'react'
import PlainButton from '../../../custom/Elements/buttons/PlainButton'
import ButtonWithImage from '../../../custom/Elements/buttons/ButtonWithImage'
import CustomLabel from '../../../custom/Elements/CustomLabel'
import { apiAction } from '../../../../api/api'
import { employee, getShareNoteUrl } from '../../../../api/urls'
import { useNavigate } from 'react-router-dom'
import { getLoginDetails, getWorkspaceInfo } from '../../../../config/cookiesInfo'
import * as Actions from '../../../../state/Actions';
import Dropdown from '../../../custom/Dropdown/Dropdown'
import RadioButton from '../../../custom/Elements/RadioButton'
import { Autocomplete, Divider, TextField } from '@mui/material'
import MultiSelectAutoCompleteDropdown from '../../../custom/Dropdown/MultiSelectAutoCompleteDropdown'

export default function ShareNotesModal(props) {

    const { setShowModal, onSuccess, data } = props
    const { work_id } = getWorkspaceInfo();
    const empData = data.employee_list
    const navigate = useNavigate();
    const loginDetails = getLoginDetails();
    const user_id = loginDetails.user_id
    const dispatch = Actions.getDispatch(useContext);
    const [employeeList, setEmployeeList] = useState([]);
    const [formData, setFormData] = useState({ workspace: work_id, share_to: [], access: 'read', note_id: data.id })
    const [sharedEmployeeList, setSharedEmployeeList] = useState(data.employee_list)

    const roleList = [
        { access: "read", title: "Read Only" },
        { access: "edit", title: "Editor" },
        { access: "edit", title: "Owner" }
    ]

    const getRoleList = (isOwner) => {
        if (isOwner) {
            return [
                { access: "read", title: "Read Only" },
                { access: "edit", title: "Editor" },
                { access: "edit", title: "Owner" }
            ]
        } else {
            return [
                { access: "read", title: "Read Only" },
                { access: "edit", title: "Editor" },
            ]
        }
    }
    useEffect(() => {
        getEmployeeList()
        console.log(data)
    }, [])
    const isEditDisable = data && data.permission === "read"
    const loginUserAccess = data && data.permission

    const handleSubmit = () => {
        shareNote()
        setShowModal(false);
    };

    const shareNote = async (postData) => {
        let res = await apiAction({ url: getShareNoteUrl(), method: 'post', navigate: navigate, dispatch: dispatch, data: postData ? postData : formData })
            .then((response) => {
                if (response) {
                    if (!postData) {
                        onSuccess()
                    }
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

                    data.employee_list.map((empObj, index) => {
                        let sharedUserIndex = employeeData.findIndex((item) => item.id === empObj.employee_id)
                        employeeData.splice(sharedUserIndex, 1)
                    })
                    setEmployeeList(employeeData.sort((a, b) => -b['employee_name'].localeCompare(a['employee_name'])))
                }
            })
            .then((error) => {
                console.log("ERROR", error)
            })
    }
    const onSelectChange = (empList) => {
        let employeeIds = []
        if (empList) {
            empList.map((item) => {
                employeeIds.push(item.id)
            })
        }
        setFormData({ ...formData, share_to: employeeIds })
    }
    const getEmployeeRoleData = (access) => {
        return roleList.find((item) => item.access == access)
    }
    const style1 = {
        control: (base, state) => ({
            ...base,
            border: "0 !important",
            boxShadow: "0 !important",
            "&:hover": {
                border: "0 !important"
            }
        })
    }

    const isAccessEditableToLoginUser = (empId, permission) => {
        return (empId === user_id && permission === 'read')
    }
    const onAccessChange = (item, access) => {
        shareNote({ workspace: work_id, share_to: [item.employee_id], access: item.permission, note_id: data.id })
    }

    return (
        <div className=''>
            <div>
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
                        {sharedEmployeeList.length > 0 && formData.share_to.length <= 0 ?
                            < div className='mt-4'>
                                <span className=' text-sm font-semibold font-quicksand'>Employees with access</span>
                                <div className='h-[0.2px] bg-gray-600 mb-2 mt-1'></div>
                                <div className='max-h-52 overflow-y-scroll'>
                                    {data.employee_list.map((item, itemIndex) => (
                                        <>
                                            <div className='flex flex-row items-center justify-between pb-1'>
                                                <div>
                                                    <span className='font-quicksand text-sm font-medium'>{item.employee_name}</span>
                                                </div>
                                                <div className='w-1/4'>
                                                    <Dropdown className={`border-0 outline-none focus:outline-none border-transparent ${data.created_by_id === item.employee_id ? "cursor-not-allowed" : "cursor-pointer"}`} style={style1}
                                                        disabled={data.created_by_id === item.employee_id || isAccessEditableToLoginUser(item.employee_id, item.permission)} placeholder={true} options={getRoleList(data.created_by_id === item.employee_id)} optionLabel={'title'} value={data.created_by_id === item.employee_id ? roleList[2] : getEmployeeRoleData(item.permission)}
                                                        setValue={(value) => {
                                                            sharedEmployeeList[itemIndex].permission = value.access
                                                            setSharedEmployeeList([...sharedEmployeeList])
                                                            onAccessChange(item, value.access)
                                                        }} />
                                                </div>
                                            </div>
                                            <Divider />
                                        </>
                                    ))}
                                </div>
                            </div>
                            : null}
                        {formData.share_to.length > 0 &&
                            <div className='mt-4'>
                                <CustomLabel label={`Access`} className={'font-quicksand font-semibold text-sm mb-1'} />
                                <div class="flex flex-row items-center mb-4 mt-2">
                                    <RadioButton title={"Read Only"} value={"read"} checked={formData.access} onChange={(val) => setFormData({ ...formData, access: val })} disable={false} />
                                    <RadioButton className={'ml-5'} title={"Write"} value={"write"} checked={formData.access} onChange={(val) => setFormData({ ...formData, access: val })} disable={isEditDisable} />
                                </div>
                            </div>
                        }
                    </div>


                    <div className={`p-6 border-solid border-slate-200 rounded-b `}>
                        <PlainButton
                            title={"Share"}
                            className={`w-full ${formData.share_to.length ? "" : 'hidden'}`}
                            onButtonClick={handleSubmit}
                            disable={formData.share_to.length <= 0 || !(sharedEmployeeList.length > 0)}>
                        </PlainButton>
                    </div>
                </form>
            </div >
        </div >
    )
}
