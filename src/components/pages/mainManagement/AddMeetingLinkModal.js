import React, { useContext, useState } from 'react'
import CustomLabel from '../../custom/Elements/CustomLabel'
import { isFormValid, notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils'
import { apiAction } from '../../../api/api'
import { useNavigate } from 'react-router-dom'
import * as Actions from '../../../state/Actions';
import { addMeetingLinkUrl, getTheModuleCreationUrl, get_all_project } from '../../../api/urls'
import { getWorkspaceInfo } from '../../../config/cookiesInfo'
import Dropdown from '../../custom/Dropdown/Dropdown'
import PlainButton from '../../custom/Elements/buttons/PlainButton'
import GidInput from '../../custom/Elements/inputs/GidInput'
import ButtonWithImage from '../../custom/Elements/buttons/ButtonWithImage'
import IconInput from '../../custom/Elements/inputs/IconInput'

export default function AddMeetingLinkModal(props) {
    const { work_id } = getWorkspaceInfo();
    const { setShowModal, onSuccess } = props
    const dispatch = Actions.getDispatch(useContext);
    const navigate = useNavigate()
    const [formData, setFormData] = useState({workspace_id:work_id})

    const onAddLink = () => {
        addNewMeetingLink()
    }
    const addNewMeetingLink = async () => {
        let validation_data = [
            { key: "title", message: 'Title field left empty!' },
            { key: "description", message: 'Description left empty!' },
            { key: "link", message: 'Link field left empty' },
        ]

        // console.log(JSON.stringify(formData, 0, 2))
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: 'post',
                navigate: navigate,
                dispatch: dispatch,
                url: addMeetingLinkUrl(),
                data: formData,
            })
            if (res.success) {
                onSuccess()
                setShowModal(false);
                notifySuccessMessage(res.status);
            } else {
                notifyErrorMessage(res.detail)
            }
        } else {
            notifyErrorMessage(message)
        }
    }


    return (
        // <div className="justify-center items-center flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-full mx-2 sm:max-w-sm md:max-w-md overflow-x-auto">
        <div className="relative my-6 md:w-2/4 w-full mx-2 sm:max-w-sm md:max-w-md overflow-x-auto">
            <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Add New Meeting'}</h3>
                    <ButtonWithImage
                        onButtonClick={() => { setShowModal(false) }}
                        title={""}
                        className={"rounded-full w-10 h-10 p-0 m-0 justify-center items-center bg-white shadow-none hover:bg-gray-200 active:bg-gray-200"}
                        icon={<i className="fa-solid fa-times text text-black self-center" color='black'></i>}
                    ></ButtonWithImage>
                </div>
                <form>
                    <div className="relative px-5 pt-2 flex-auto">


                        <div className="my-4 flex flex-col">
                            <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Title"} />
                            <GidInput
                                inputType={"text"}
                                disable={false}
                                placeholderMsg={"Enter link title"}
                                className={""}
                                value={formData.title ? formData.title : ''}
                                onBlurEvent={() => { }}
                                onTextChange={(e) => {
                                    setFormData((previous) => ({ ...previous, title: e.target.value }))
                                }}>

                            </GidInput>
                        </div>

                        <div className="my-4 flex flex-col">
                            <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Description"} />
                            <GidInput
                                inputType={"text"}
                                disable={false}
                                placeholderMsg={"Enter link description"}
                                className={""}
                                value={formData.description ? formData.description : ''}
                                onBlurEvent={() => { }}
                                onTextChange={(e) => {
                                    setFormData((previous) => ({ ...previous, description: e.target.value }))
                                }}>

                            </GidInput>
                        </div>
                        <div className="my-4 flex flex-col">
                            <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Link"} />
                            <GidInput
                                inputType={"text"}
                                disable={false}
                                placeholderMsg={"Enter link"}
                                className={""}
                                value={formData.link ? formData.link : ''}
                                onBlurEvent={() => { }}
                                onTextChange={(e) => {
                                    setFormData((previous) => ({ ...previous, link: e.target.value }))
                                }}>

                            </GidInput>
                        </div>

                    </div>

                    <div className="p-6 border-solid border-slate-200 rounded-b">
                        <PlainButton title={"Add"} className={"w-full"} onButtonClick={onAddLink} disable={false}></PlainButton>
                    </div>
                </form>


            </div>
        </div>
        // </div>
    )
}
