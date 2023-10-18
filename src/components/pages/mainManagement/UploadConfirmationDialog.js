import React, { useContext } from 'react'
import { apiAction } from '../../../api/api'
import { getWorkspaceInfo } from '../../../config/cookiesInfo'
import { notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils'
import { getTheDeletePeriodicNotificationUrl } from '../../../api/urls'
import PlainButton from '../../custom/Elements/buttons/PlainButton'
import * as Actions from '../../../state/Actions';
import { useNavigate } from 'react-router-dom';
import { routesName } from '../../../config/routesName'


export default function UploadConfirmationDialog(props) {
    const { setShowModal, onSuccess, onCancel, title, subtitle } = props
    const { work_id } = getWorkspaceInfo()
    const dispatch = Actions.getDispatch(useContext);
    const navigate = useNavigate();

    return (

        <>
            <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                <span className="text-xl font-quicksand font-bold text-center w-full">{'Confirmation'}</span>

                <button
                    className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                    onClick={() => setShowModal(false)}
                >
                    <i className="fa-solid fa-times"></i>
                </button>
            </div>
            <div className='px-5 mt-5 text-black font-quicksand font-medium'>
            We are about to add the Tasks, please make sure that columns have correct values !
            </div>
            <div className='px-3 py-5 w-full flex flex-col'>
                <PlainButton title={"It looks right,Go ahead, add the Tasks."} className={"mt-10"} onButtonClick={()=>onSuccess()} disable={false}></PlainButton>
            </div>
        </>
    )
}
