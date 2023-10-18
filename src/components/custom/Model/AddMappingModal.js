import React, { useContext, useState } from 'react'
import CustomLabel from '../../custom/Elements/CustomLabel'
import { isFormValid, notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils'
import { apiAction } from '../../../api/api'
import { useNavigate } from 'react-router-dom'
import * as Actions from '../../../state/Actions';
import { getCreateNewMappingUrl, getCreateProjectUrl } from '../../../api/urls'
import { getWorkspaceInfo } from '../../../config/cookiesInfo'
import GidInput from '../../custom/Elements/inputs/GidInput'
import PlainButton from '../../custom/Elements/buttons/PlainButton'
import ButtonWithImage from '../../custom/Elements/buttons/ButtonWithImage'

export default function AddMappingModal(props) {
    const { setShowModal, data = {}, onSuccess = () => { } } = props
    const state = Actions.getState(useContext);
    const dispatch = Actions.getDispatch(useContext);
    const { mappings, mapping_for, mapping, model_fields } = state
    const { work_id } = getWorkspaceInfo();
    const [formData, setFormData] = useState({ ...data, workspace_id: work_id })
    const navigate = useNavigate()

    const createNewMapping = async () => {
        let validation_data = [
            { key: "name", message: 'Project field left empty!' },
            { key: "workspace_id", message: 'Workspace left empty!' },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            onSuccess(formData.name, formData.description)
            setShowModal(false)
        } else {
            notifyErrorMessage(message)
        }
    }


    return (
        // <div className="relative my-6 md:w-2/4 w-full mx-2 sm:max-w-sm md:max-w-md overflow-x-auto">
        //         <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
        <>
            {/* header */}
            <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Create New Mapping'}</h3>
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
                        <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Name"} />
                        <GidInput
                            inputType={"text"}
                            disable={false}
                            className={""}
                            placeholderMsg={"Enter mapping name"}
                            value={formData.name ? formData.name : ''}
                            onBlurEvent={() => { }}
                            onTextChange={(e) => {
                                setFormData((previous) => ({ ...previous, name: e.target.value }))
                            }}>

                        </GidInput>
                    </div>

                    <div className="my-4 flex flex-col">
                        <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Description"} />
                        <GidInput
                            inputType={"text"}
                            disable={false}
                            className={""}
                            placeholderMsg={"Enter description"}
                            value={formData.description ? formData.description : ""}
                            onBlurEvent={() => { }}
                            onTextChange={(e) => {
                                setFormData((previous) => ({ ...previous, description: e.target.value }))
                            }}>

                        </GidInput>
                    </div>

                </div>


                <div className="p-6 border-solid border-slate-200 rounded-b">
                    <PlainButton title={"Submit"} className={"w-full"} onButtonClick={createNewMapping} disable={false}></PlainButton>
                </div>

            </form>
        </>

        //     </div>
        // </div>
    )
}
