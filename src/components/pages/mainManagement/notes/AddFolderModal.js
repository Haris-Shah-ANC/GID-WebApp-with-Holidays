import React, { useContext, useEffect, useRef, useState } from 'react'
import CustomLabel from '../../../custom/Elements/CustomLabel'
import { apiAction } from '../../../../api/api'
import { useNavigate } from 'react-router-dom'
import * as Actions from '../../../../state/Actions';
import { getAddFolderUrl, getCreateProjectUrl, getUpdateFolderUrl } from '../../../../api/urls'
import { getLoginDetails, getWorkspaceInfo } from '../../../../config/cookiesInfo'
import GidInput from '../../../custom/Elements/inputs/GidInput'
import PlainButton from '../../../custom/Elements/buttons/PlainButton'
import ButtonWithImage from '../../../custom/Elements/buttons/ButtonWithImage'
import { isFormValid, notifyErrorMessage, notifyInfoMessage, notifySuccessMessage } from '../../../../utils/Utils';

export default function AddFolderModal(props) {
    const { work_id } = getWorkspaceInfo();
    const loginDetails = getLoginDetails();
    const user_id = loginDetails.user_id
    const [formData, setFormData] = useState({ workspace: work_id, name: "", })
    const { setShowModal, onSuccess, data = null } = props
    const dispatch = Actions.getDispatch(useContext);
    const navigate = useNavigate()
    const inputRef = useRef(null)
    useEffect(() => {
        inputRef.current.focus()
        if (data) {
            setFormData({ ...formData, name: data.folder_name, folder: data.folder })
        }
    }, [data])

    const createFolder = async () => {
        let validation_data = [
            { key: "name", message: 'Project field left empty!' },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: data && data.folder ? 'put' : 'post',
                // navigate: navigate,
                dispatch: dispatch,
                url: data && data.folder ? getUpdateFolderUrl() : getAddFolderUrl(),
                data: formData,
            })
            if (res) {
                onSuccess()
                setShowModal(false);
            } else {

            }
        } else {
            notifyErrorMessage(message)
        }
    }

    return (

        <>
            {/* header */}
            <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                <h3 className="text-lg font-quicksand font-bold text-center w-full">{data ? 'Edit Topic': 'Add Topic'}</h3>
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
                        <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Topic Name"} />
                        <GidInput
                            reference={inputRef}
                            inputType={"text"}
                            disable={false}
                            className={""}
                            placeholderMsg={"Enter topic name"}
                            value={formData.name ? formData.name : ''}
                            onBlurEvent={() => { }}
                            onTextChange={(e) => {
                                setFormData((previous) => ({ ...previous, name: e.target.value }))
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    createFolder()
                                    e.preventDefault()

                                }
                            }}
                        >


                        </GidInput>
                    </div>
                </div>
                <div className="p-6 border-solid border-slate-200 rounded-b">
                    <PlainButton title={"Submit"} className={"w-full"} onButtonClick={createFolder} disable={false}></PlainButton>
                </div>

            </form>
        </>
    )
}
