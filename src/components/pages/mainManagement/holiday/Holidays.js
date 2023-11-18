import React, { useContext, useEffect, useState } from "react";
import { formatDate, notifySuccessMessage } from "../../../../utils/Utils";
import { add_holiday, delete_modal } from "../../../../utils/Constant";
import PlainButton from "../../../custom/Elements/buttons/PlainButton";
import AddHolidayForm from "./AddHolidayForm";
import { getDeleteHolidaysUrl, getHolidaysUrl } from "../../../../api/urls";
import { getLoginDetails, getWorkspaceInfo } from "../../../../config/cookiesInfo";
import { apiAction } from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import * as Actions from '../../../../state/Actions';
import CommonDeletePupUp from "../../../custom/Model/CommonDeletePupUp";
import { ModeComment } from "@mui/icons-material";
import ModelComponent from "../../../custom/Model/ModelComponent";



const Holidays = () => {
    const { work_id, role } = getWorkspaceInfo();
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(useContext);
    const [isFormVisible, setFormVisible] = useState(false);
    const [holidays, setHolidays] = useState([]);
    const [deleteModalVisibility, setDeletePopUp] = useState(false)
    const [isNetworkCallRunning, setNetworkCallStatus] = useState(false)

    const [holidayToEdit, setHolidayToEdit] = useState(null);

    useEffect(() => {
        fetchHolidays()
    }, [])


    const onSuccess = (data, isItEditAction, index) => {
        if (isItEditAction) {
            holidays[index] = data
        } else {
            holidays.push(data)
        }
        setHolidays(holidays)
        setHolidayToEdit(null)
    }
    const fetchHolidays = async () => {
        setNetworkCallStatus(true)
        let res = await apiAction({ url: getHolidaysUrl(work_id), method: 'get', navigate: navigate, dispatch: dispatch })
            .then((response) => {
                setNetworkCallStatus(false)
                if (response) {
                    setHolidays(response.result)
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })

    }
    const deleteHoliday = async (id) => {
        setNetworkCallStatus(true)
        let res = await apiAction({ url: getDeleteHolidaysUrl(work_id), method: 'post', navigate: navigate, dispatch: dispatch, data: { "workspace_id": work_id, "holiday_id": [id] } })
            .then((response) => {
                setNetworkCallStatus(false)
                if (response) {
                    notifySuccessMessage(response.status)
                    const findHoliday = holidays.findIndex((data, i) => data.holiday_id == id);
                    holidays.splice(findHoliday, 1)
                    setHolidays(holidays)
                }
            })
            .catch((error) => {
                console.log("ERROR", error)
            })

    }
    const onDeleteHoliday = (id, type) => {
        deleteHoliday(id)
        console.log("ON DELETE", id)
    }


    return (

        <div className="">
            {deleteModalVisibility && <ModelComponent showModal={deleteModalVisibility} setShowModal={setDeletePopUp} onSuccessDelete={onDeleteHoliday} data={{ id: holidays[holidayToEdit].holiday_id, title: "Remove holiday?", subTitle: `Are you sure to remove holiday '${holidays[holidayToEdit].event_name}' ?` }} />}
            <div className="flex flex-row justify-between px-2 pt-5">
                <span className=" text-2xl">Holidays</span>

                {role == "Admin" &&
                    <div className="flex justify-end">
                        {!isFormVisible && <PlainButton title={"Add New"} onButtonClick={() => {
                            setHolidayToEdit(null)
                            setFormVisible(true)
                        }} className={""} disable={false} />}
                    </div>
                }
                
            </div>
            {isFormVisible && <AddHolidayForm onClose={() => {
                setFormVisible(false)
            }} onSuccess={onSuccess} data={holidays[holidayToEdit]} index={holidayToEdit} />}
            {holidays.length > 0 &&
                <div className="flex mx-2 rounded mt-5">
                    <table className=" bg-transparent border-collapse table-auto w-full rounded-lg">
                        <thead className='bg-gray-200 px-10 justify-center items-center'>
                            <tr className='justify-between h-10'>
                                <th
                                    key={"sr_no"}
                                    className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold  font-quicksand font-bold`}>
                                    Sr/No
                                </th>
                                <th
                                    key={"name"}
                                    className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold   font-quicksand font-bold`}>
                                    Name
                                </th>
                                <th
                                    key={"valid_upto"}
                                    className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold  font-quicksand font-bold`}>
                                    Date
                                </th>
                                {role == "Admin" &&
                                    <th
                                        key={"action"}
                                        className={`text-sm text-center  text-blueGray-500 font-interVar font-bold  font-quicksand font-bold`}>
                                        Action
                                    </th>
                                }
                            </tr>
                        </thead>
                        <tbody className=" divide-y divide-gray-200 table-fixed">
                            {holidays.map((item, index) => (
                                <tr key={index} className={`bg-white justify-between`} onClick={() => { }}>
                                    <td className="p-4">
                                        <p className='text-md text-left font-quicksand'>
                                            {index + 1}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <p className='flex text-left text-md font-quicksand'>
                                            {item.event_name}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <p className='text-md text-left capitalize font-quicksand'>
                                            {formatDate(item.holiday_date, "DD-MM-YYYY")}
                                        </p>
                                    </td>
                                    {role == "Admin" &&
                                        <td className="p-4 ">
                                            <div className="justify-around flex-row flex">
                                                <svg
                                                    viewBox="0 0 1024 1024"
                                                    fill="currentColor"
                                                    height="1em"
                                                    width="1em"
                                                    className="cursor-pointer hover:fill-blue-500"
                                                    onClick={() => {
                                                        setHolidayToEdit(index)
                                                        setFormVisible(true)
                                                    }}

                                                >
                                                    <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" />
                                                </svg>
                                                <div className="justify-center flex">
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="#af4141"
                                                        height="1em"
                                                        width="1em"
                                                        className="cursor-pointer hover:fill-red-500"
                                                        onClick={() => {
                                                            console.log("ITEM", item)
                                                            setHolidayToEdit(index)
                                                            setDeletePopUp(delete_modal)
                                                        }}
                                                    >
                                                        <path fill="none" d="M0 0h24v24H0z" />
                                                        <path d="M17 6h5v2h-2v13a1 1 0 01-1 1H5a1 1 0 01-1-1V8H2V6h5V3a1 1 0 011-1h8a1 1 0 011 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            }
            {holidays.length == 0 &&
                <div className="flex justify-center text-center mt-[35vh]">
                    <span className="font-quicksand font-medium">No data to show.</span>
                </div>}

        </div>
    )
}



export default Holidays;
