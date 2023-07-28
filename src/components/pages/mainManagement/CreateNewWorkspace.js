import React, { useState } from 'react';
import Input from '../../custom/Elements/Input';
import { apiAction } from '../../../api/api';
import { getTheCreateWorkspaceUrl } from '../../../api/urls';
import { isFormValid, notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils';
import * as Actions from '../../../state/Actions';
import PlainButton from '../../custom/Elements/buttons/PlainButton';
import ButtonWithImage from '../../custom/Elements/buttons/ButtonWithImage';
import GidInput from '../../custom/Elements/inputs/GidInput';
import IconInput from '../../custom/Elements/inputs/IconInput';

const CreateNewWorkspace = (props) => {
    const { setShowModal } = props
    const [wsFormData, setWorkspaceFormData] = useState({office_start_time: '', office_end_time: '', workspace_name: ''})
    const dispatch = Actions.getDispatch(React.useContext);
    const handleWorkspaceNameChange = (e) => {
        setWorkspaceFormData({...wsFormData, workspace_name: e.target.value});
    };

    const handleClockInChange = (e) => {
        setWorkspaceFormData({...wsFormData, office_start_time: e.target.value});
    };

    const handleClockOutChange = (e) => {
        setWorkspaceFormData({...wsFormData, office_end_time: e.target.value});
    };

    const handleSaveChanges = () => {

        createWorkspace()
    };

    const createWorkspace = async() =>{
        // let response = await apiAction({url: getTheCreateWorkspaceUrl(), method: "post", data: wsFormData})
        // if(response.success){

        // }
        let validation_data = [
            { key: "workspace_name", message: 'Workspace field left empty!' },
            { key: "office_start_time", message: `Workspace start time field left empty!` },
            { key: "office_end_time", message: 'Workspace end time field left empty!' },
        ]
        console.log(JSON.stringify(wsFormData, 0, 2))
        const { isValid, message } = isFormValid(wsFormData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: 'post',
                // navigate: navigate,
                dispatch: dispatch,
                url:getTheCreateWorkspaceUrl(),
                data: wsFormData,
            })
            if (res.success) {
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
        <div className="relative my-6 w-full mx-2 sm:max-w-sm md:max-w-md overflow-x-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-center justify-between p-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center justify-center w-full">Create New Workspace</h3>                   
                    <ButtonWithImage
                        onButtonClick={()=>{setShowModal(false)}} 
                        title={""}
                        className={"rounded-full w-10 h-10 p-0 m-0 justify-center items-center bg-white shadow-none hover:bg-gray-200 active:bg-gray-200"}
                        icon={<i className="fa-solid fa-times text text-black self-center" color='black'></i> }
                        ></ButtonWithImage>
                </div>

                {/* body */}
                <div className="relative p-6 flex-auto">
                    <div className="my-1 flex flex-col">
                        <label className="text-slate-500 ont-quicksand font-semibold text-sm mb-1" htmlFor="workspaceName">Workspace Name</label>
                        <GidInput 
                            inputType={"text"} 
                            disable={false} 
                            className={""} 
                            placeholderMsg={"Enter workspace name"}
                            value={wsFormData.workspace_name ? wsFormData.workspace_name : ''} 
                            onBlurEvent={() => {}}
                            onTextChange={handleWorkspaceNameChange}>
                        </GidInput>
                    </div>
                    <div className="my-4 flex flex-col">
                        <label className="text-slate-500 flex items-center ont-quicksand font-semibold text-sm mb-1" htmlFor="clock-in">
                            <i className="fa-regular fa-clock text-base mr-1"></i>
                            Clock In
                        </label>
                        <IconInput
                            inputType={"time"}
                            id="clock-in"
                            disable={false}
                            className={`w-full`}
                            value={wsFormData.office_start_time ? wsFormData.office_start_time : ''}
                            onTextChange={handleClockInChange}
                            onBlurEvent={() => {}}
                            placeholder={""}
                            isRightIcon={true}
                            >
                        </IconInput>
                    </div>
                    <div className="my-4 flex flex-col">
                        <label className="text-slate-500 flex items-center ont-quicksand font-semibold text-sm mb-1" htmlFor="clock-out">
                            <i className="fa-regular fa-clock text-base mr-1"></i>
                            Clock Out
                        </label>
                        <IconInput
                            inputType={"time"}
                            id="clock-in"
                            disable={false}
                            className={`w-full`}
                            value={wsFormData.office_end_time ? wsFormData.office_end_time   : ''}
                            onTextChange={handleClockOutChange}
                            onBlurEvent={() => {}}
                            placeholder={""}
                            isRightIcon={true}
                            >
                        </IconInput>
                    </div>
                </div>

                {/* footer */}
                <div className="p-6 border-solid border-slate-200 rounded-b">
                    <PlainButton title={"Create"} className={"w-full"} onButtonClick={handleSaveChanges} disable={false}></PlainButton>
                </div>



            </div>
        </div>
    );
};

export default CreateNewWorkspace;