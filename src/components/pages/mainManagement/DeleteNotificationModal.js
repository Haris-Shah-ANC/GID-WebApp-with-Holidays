import React, {  useContext } from 'react'
import { apiAction } from '../../../api/api'
import { getWorkspaceInfo } from '../../../config/cookiesInfo'
import {notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils'
import {  getTheDeletePeriodicNotificationUrl } from '../../../api/urls'
import PlainButton from '../../custom/Elements/buttons/PlainButton'
import * as Actions from '../../../state/Actions';
import { useNavigate } from 'react-router-dom';
import { routesName } from '../../../config/routesName'


export default function DeleteNotificationModal(props) {
    const { setShowModal, data } = props
    const { work_id } = getWorkspaceInfo()
    const dispatch = Actions.getDispatch(useContext);
    const navigate = useNavigate();

    const onNotificationDelete = () => {
        deletePeriodicNotification({ "periodic_task_id": data.periodic_task_id, "workspace_id": work_id})
    }

    const deletePeriodicNotification = async (pBody) => {
        let res = await apiAction({
            method: 'post',
            // navigate: navigate,
            dispatch: dispatch,
            url: getTheDeletePeriodicNotificationUrl(),
            data: pBody,
        })

        if (res && res.success) {
            setShowModal(false);
            notifySuccessMessage(res.status);
            navigate(routesName.analytics.path)
        } else {
            notifyErrorMessage("Something went wrong")
        }

    }


    return (
        // <div
        //     className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        //     <div className="relative my-6 max-w-sm w-full">
        //         <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
        <>
                    {/* header */}
                    <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                        <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Are you sure to delete'}</h3>

                        <button
                            className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                            onClick={() => setShowModal(false)}
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
                    </div>

                    <div className='px-3 py-5 w-full flex flex-col'>
                        <h3 className="text-lg font-quicksand font-bold text-center w-full">{data.task_type}</h3>

                        <PlainButton title={"Delete"} className={"mt-10"} onButtonClick={onNotificationDelete} disable={false}></PlainButton>
                    </div>
        </>
        //         </div>
        //     </div>
        // </div>
    )
}
