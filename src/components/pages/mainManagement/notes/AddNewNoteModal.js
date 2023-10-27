import React, { useContext, useEffect, useState } from 'react'
import CustomLabel from '../../../custom/Elements/CustomLabel'
import { apiAction } from '../../../../api/api'
import { useNavigate } from 'react-router-dom'
import * as Actions from '../../../../state/Actions';
import { getAddFolderUrl, getAddNoteUrl, getCreateProjectUrl, getUpdateNoteUrl } from '../../../../api/urls'
import { getLoginDetails, getWorkspaceInfo } from '../../../../config/cookiesInfo'
import GidInput from '../../../custom/Elements/inputs/GidInput'
import PlainButton from '../../../custom/Elements/buttons/PlainButton'
import ButtonWithImage from '../../../custom/Elements/buttons/ButtonWithImage'
import { isFormValid, notifyErrorMessage, notifyInfoMessage, notifySuccessMessage } from '../../../../utils/Utils';
import { LinkedText } from '../../../custom/Elements/buttons/LinkedText';
import Dropdown from '../../../custom/Dropdown/Dropdown';

export default function AddNewNoteModal(props) {
    const { setShowModal, onSuccess, data = null } = props
    const { work_id } = getWorkspaceInfo();
    const loginDetails = getLoginDetails();
    const user_id = loginDetails.user_id
    const [formData, setFormData] = useState({ employee: user_id, workspace: work_id, title: data ? data.title : "", folder_id: data ? data.folder_id : null, folder_name: "", note: "" })
    let folderList = [{ folder_name: "Select", id: null }, ...data.folders,]
    const dispatch = Actions.getDispatch(useContext);
    const navigate = useNavigate()
    const [isNewFolderInput, setNewFolderInputVisible] = useState(false)

    let selectedFolder = data ? data.folders.find((item) => item.id == formData.folder_id) : null

    useEffect(() => {
        if (data) {
            setFormData({ ...formData, note_id: data.note_id })
        }
    }, [data])
    const createNote = async () => {
        let validation_data = [
            { key: "title", message: 'title field left empty!' },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: data ? "put" : 'post',
                // navigate: navigate,
                dispatch: dispatch,
                url: data ? getUpdateNoteUrl(data.note_id) : getAddNoteUrl(),
                data: formData,
            })
            if (res.success) {
                onSuccess()
                setShowModal(false);
                notifySuccessMessage(res.status);
            } else {
                notifyInfoMessage(res.detail)
            }
        } else {
            notifyErrorMessage(message)
        }
    }

    const createFolder = async () => {
        let validation_data = [
            { key: "folder_name", message: 'Project field left empty!' },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: 'post',
                // navigate: navigate,
                dispatch: dispatch,
                url: getAddFolderUrl(),
                data: formData,
            })
                .then((response) => {
                    if (response.success) {
                        setFormData({ ...formData, folder_id: response.result.id })
                        createTheNote()
                    } else {
                        notifyInfoMessage(response.detail)
                    }
                })

        } else {
            notifyErrorMessage(message)
        }
    }
    const createTheNote = () => {
        createNote()
    }
    const onSubmitClick = () => {
        let validation_data = [
            { key: "folder_name", message: 'Project field left empty!' },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isNewFolderInput && isValid) {
            console.log("CREATE FOLDER")
            delete formData.folder_name
            createFolder()
        } else if (formData.folder_id) {
            console.log("FOLDER ID")
            delete formData.folder_name
            createNote()
        } else {
            console.log("WITHOUT FOLDER")
            delete formData.folder_name
            delete formData.folder_id
            createNote()
        }
    }


    return (

        <>
            {/* header */}
            <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                <h3 className="text-lg font-quicksand font-bold text-center w-full">{data.title ? 'Edit Note' : 'Add Note'}</h3>
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
                            className={""}
                            placeholderMsg={"Enter title"}
                            value={formData.title ? formData.title : ''}
                            onBlurEvent={() => { }}
                            onTextChange={(e) => {
                                setFormData((previous) => ({ ...previous, title: e.target.value }))
                            }}>

                        </GidInput>
                    </div>
                    <div className="my-4 flex flex-col">
                        <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Organize under.."} />
                        {isNewFolderInput ?
                            <GidInput
                                inputType={"text"}
                                disable={false}
                                className={""}
                                placeholderMsg={"Enter topic name"}
                                value={formData.folder_name ? formData.folder_name : ''}
                                onBlurEvent={() => { }}
                                onTextChange={(e) => {
                                    setFormData((previous) => ({ ...previous, folder_name: e.target.value }))
                                }}>
                            </GidInput>
                            :
                            <>
                                <Dropdown disabled={false} placeholder={true} options={data ? folderList : []} optionLabel={'name'} value={selectedFolder ? selectedFolder : { folder_name: 'Select' }} setValue={(value) => setFormData((previous) => ({ ...previous, folder_id: value ? value.id : null }))} />
                                <LinkedText title={"Add new"} onClick={() => setNewFolderInputVisible(true)} />
                            </>
                        }
                    </div>
                </div>
                <div className="p-6 border-solid border-slate-200 rounded-b">
                    <PlainButton title={"Submit"} className={"w-full"} onButtonClick={onSubmitClick} disable={false}></PlainButton>
                </div>

            </form>
        </>
    )
}
