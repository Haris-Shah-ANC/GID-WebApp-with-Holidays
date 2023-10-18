import React, { useContext, useEffect, useState } from 'react'
import PlainButton from '../../../custom/Elements/buttons/PlainButton'
import * as Actions from '../../../../state/Actions';
import { getWorkspaceInfo } from '../../../../config/cookiesInfo';
import { apiActionFormData } from '../../../../api/api';
import { getUploadTimeSheetUrl, getValidateTimeSheetData } from '../../../../api/urls';
import UploadConfirmationDialog from '../UploadConfirmationDialog';
import { import_confirmation } from '../../../../utils/Constant';
import ModelComponent from '../../../custom/Model/ModelComponent';
import { formatText, notifyInfoMessage, notifySuccessMessage } from '../../../../utils/Utils';
import Loader from '../../../custom/Loaders/Loader';
import { Divider, } from '@mui/material';
import TableHeader from '../../../custom/TableHeader';
import { useNavigate } from 'react-router-dom';
import { routesName } from '../../../../config/routesName';
import TableRow from '../../../custom/TableRow';

export function DisplayMappedColumnFile(props) {
    const { } = props
    const state = Actions.getState(useContext);
    const dispatch = Actions.getDispatch(useContext);
    const { work_id } = getWorkspaceInfo()
    const { mappings, mapping_for, mapping, model_fields } = state
    const { rows, fileName, columns, uploadedFile, file_headers, mapped_headers } = mappings
    const [errors, setErrors] = useState(null)
    const [modalVisibility, setConfirmationModalVisible] = useState(false)
    const [mappedColumns, setMappedColumns] = useState([])
    const [isNetworkCallRunning, setNetworkCallStatus] = useState(false)
    const navigate = useNavigate();

    const mapped_items = model_fields.filter((field) => field.file_header)

    useEffect(() => {
        if (mapping) {
            validateTimeSheetFile()
        }

    }, [])

    const validateTimeSheetFile = async () => {
        setNetworkCallStatus(true)
        let res = await apiActionFormData({ url: getValidateTimeSheetData(), method: "post", data: { file: uploadedFile, workspace_id: work_id, mapping_id: mapping.id } })
            .then((response) => {
                setNetworkCallStatus(false)
                if (response.success) {
                    setErrors(response.result)
                } else {
                    notifyInfoMessage(response.status)

                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }
    const uploadTimeSheet = async () => {
        setNetworkCallStatus(true)
        let response = await apiActionFormData({ url: getUploadTimeSheetUrl(), method: 'post', data: { "file": uploadedFile, workspace_id: work_id, mapping_id: mapping.id } }, onError)
        if (response) {
            setNetworkCallStatus(false)
            if (response.success) {
                notifySuccessMessage(response.status)
                navigate(routesName.dashboard.path)
            } else {
                notifyInfoMessage(response.status)
            }
        }
        function onError(err) {
            console.log("UPLOAD ERROR", err)
        }
    }
    return (
        <div className=' mx-2 mt-3  flex flex-col pb-3'>
            <ModelComponent showModal={modalVisibility} setShowModal={setConfirmationModalVisible} onSuccess={() => {
                setConfirmationModalVisible(false)
                uploadTimeSheet()
            }} from={import_confirmation} />
            <div className='flex flex-row gap-6 py-4 items-center justify-between bg-white'>
                <div className='w-[300px]'>
                    {!isNetworkCallRunning && errors && errors.length > 0 ? <span className='px-3 font-quicksand font-bold text-xl'> Errors</span> : null}
                </div>
                <div className='gap-6 flex'>
                    {!isNetworkCallRunning && errors && errors.length > 0 ?
                        <PlainButton onButtonClick={() => {
                            Actions.resetFileImports(dispatch)
                        }}
                            title={"Go Back"} className={"py-2"} disable={false} />
                        :
                        <>
                            <PlainButton onButtonClick={() => {
                                Actions.resetFileImports(dispatch)
                            }}
                                title={"Cancel"} className={"py-2"} disable={false} />

                            <PlainButton onButtonClick={() => {
                                setConfirmationModalVisible(import_confirmation)

                            }}
                                title={"Save"} className={"py-2"} disable={!errors} />
                        </>
                    }

                </div>
            </div>
            <Divider />

            {!isNetworkCallRunning && errors && errors.length == 0 ? <TimeSheetTable columnsList={columns} rowsList={rows} mappedItems={mapped_items} mapping={mapping} /> : null}

            {!isNetworkCallRunning && errors && errors.length > 0 ?

                <div className='mb-4 px-3 overflow-auto bg-white' style={{ height: 'calc(100vh - 220px)', }}>
                    {errors.map((item, index) => {
                        return (
                            <div className='my-5 flex flex-row items-center' >
                                <p className='text-red-500'>{index + 1}.</p>
                                <p className='text-red-500 pl-4'>{item}</p>

                            </div>
                        )
                    })}

                </div>
                : null}
            {isNetworkCallRunning && <Loader></Loader>}
        </div>
    )
}
export default function TimeSheetTable(props) {
    const { columnsList, rowsList, mappedItems, mapping } = props
    let mapped = mapping.mapping

    return (
        <div className='fixTableHead w-full'>
            <table className=" bg-transparent table-auto w-full" >
                <thead className='bg-gray-200 px-10 justify-center items-center'>
                    <TableHeader headerList={Object.keys(mapped)} className={`text-left w-auto pl-4`}></TableHeader>
                </thead>

                <tbody className=" divide-y divide-gray-200" >
                    {
                        rowsList.map((item, index) => {
                            return (
                                <tr key={1} className={"bg-white hover:bg-blue-100"} >
                                    {Object.values(mapped).map((cols, i) => {
                                        return <TableRow onItemClick={() => ""} item={item[cols]} index={index} className={``} />
                                    })}
                                </tr>
                            )
                        })
                    }
                </tbody>

            </table>
        </div>
    )
}
