import React, { useState } from 'react';
import Input from '../../custom/Elements/Input';
import { apiAction } from '../../../api/api';
import { getTheCreateWorkspaceUrl } from '../../../api/urls';
import { isFormValid, notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils';
import * as Actions from '../../../state/Actions';

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
        <div className="relative my-6 md:w-2/4">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-center justify-between p-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center justify-center w-full">Create New Workspace</h3>
                    <button
                        className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                        onClick={() => setShowModal(false)}
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                {/* body */}
                <div className="relative p-6 flex-auto">
                    <div className="my-1 flex flex-col">
                        <label className="text-slate-500 ont-quicksand font-semibold text-sm mb-1" htmlFor="workspaceName">Workspace Name</label>
                        <Input
                            type="text"
                            id="workspaceName"
                            name="workspaceName"
                            placeholder="Enter workspace name"
                            value={wsFormData.workspace_name}
                            onChange={handleWorkspaceNameChange}
                        />
                    </div>
                    <div className="my-4 flex flex-col">
                        <label className="text-slate-500 flex items-center ont-quicksand font-semibold text-sm mb-1" htmlFor="clock-in">
                            <i className="fa-regular fa-clock text-base mr-1"></i>
                            Clock In
                        </label>
                        <Input
                            type="time"
                            id="clock-in"
                            name="clock-in"
                            value={wsFormData.office_start_time}
                            onChange={handleClockInChange}
                        />
                    </div>
                    <div className="my-4 flex flex-col">
                        <label className="text-slate-500 flex items-center ont-quicksand font-semibold text-sm mb-1" htmlFor="clock-out">
                            <i className="fa-regular fa-clock text-base mr-1"></i>
                            Clock Out
                        </label>
                        <Input
                            type="time"
                            id="clock-out"
                            name="clock-out"
                            value={wsFormData.office_end_time}
                            onChange={handleClockOutChange}
                        />
                    </div>
                </div>

                {/* footer */}
                <div className="p-6 border-solid border-slate-200 rounded-b">
                    <button
                        className="bg-blue-500 text-white active:bg-blue-600 font-bold text-sm w-full py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </button>
                </div>



            </div>
        </div>
    );
};

export default CreateNewWorkspace;