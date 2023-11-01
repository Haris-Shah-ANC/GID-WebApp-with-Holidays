import React, { useContext } from 'react'
import PlainButton from '../Elements/buttons/PlainButton'
import { apiAction } from '../../../api/api'
import { getWorkspaceInfo } from '../../../config/cookiesInfo'
import * as Actions from '../../../state/Actions';
import { useNavigate } from 'react-router-dom';
import { notifyErrorMessage } from '../../../utils/Utils';

export default function CommonDeletePupUp(props) {
    const { setShowModal, onSuccess, data } = props
    const { work_id } = getWorkspaceInfo()
    const dispatch = Actions.getDispatch(useContext);
    const navigate = useNavigate();

    console.log("MODAL DATA",data)
    const onDeleClick = () => {
        onSuccess(data.id,data.type)
        setShowModal(false)
    }

    return (
        <div>
            <>
                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{data.title}</h3>

                    <button
                        className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                        onClick={() => setShowModal(false)}
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                <div className='px-3 py-5 w-full flex flex-col'>
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{data.subTitle}</h3>

                    <PlainButton title={"Yes , Delete"} className={"mt-10"} onButtonClick={onDeleClick} disable={false}></PlainButton>
                </div>
            </>
        </div>
    )
}
