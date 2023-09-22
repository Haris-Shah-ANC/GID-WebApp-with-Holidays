import { useState, useContext, useEffect } from "react"
import GidInput from "./Elements/inputs/GidInput"
import { formatDate, notifySuccessMessage } from "../../utils/Utils"
import { getDeleteTaskEffortsUrl, getTheAddTaskEffortsUrl, getTheListOfTaskEffortsUrl } from "../../api/urls"
import { useNavigate } from 'react-router-dom';
import * as Actions from '../../state/Actions';
import { apiAction } from "../../api/api"

export default function EffortsComponent(props) {
    const { data } = props
    const [listOfTaskEfforts, setListOfEfforts] = useState([])
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(useContext);

    useEffect(() => {
        getEmployeeTaskEfforts()
    }, [])

    const onEditClick = (itemIndex) => {

    }
    const onAddItemLineClick = (index) => {
        listOfTaskEfforts.push({ working_date: "", working_duration: "", action: "" })
        setListOfEfforts([...listOfTaskEfforts])
    }
    const onRowRemove = (itemIndex) => {
        listOfTaskEfforts.splice(itemIndex, 1)
        setListOfEfforts([...listOfTaskEfforts])
    }
    const onAddAndSaveNewItem = (index) => {
        addEmployeeTaskEfforts(index)
        // listOfTaskEfforts[index].action = "edit"
        // setListOfEfforts([...listOfTaskEfforts])
    }
    const addEmployeeTaskEfforts = async (index) => {
        const payload = { workspace_id: data.work_id, task_id: data.task_id, hour: listOfTaskEfforts[index].working_duration, working_date: listOfTaskEfforts[index].working_date }
        let res = await apiAction({ url: getTheAddTaskEffortsUrl(), method: 'post', data: payload, navigate: navigate, dispatch: dispatch })
        if (res) {
            notifySuccessMessage(res.status);
            getEmployeeTaskEfforts()
        }
    }
    const getEmployeeTaskEfforts = async () => {
        let res = await apiAction({ url: getTheListOfTaskEffortsUrl(data.work_id, data.task_id), method: 'get', data: {}, navigate: navigate, dispatch: dispatch })
        if (res) {
            setListOfEfforts(res.result.list_task_record)
        }
    }
    const deleteTaskEfforts = async (id) => {
        let res = await apiAction({ url: getDeleteTaskEffortsUrl(), method: 'post', data: { task_record_id: id,workspace_id:data.work_id }, navigate: navigate, dispatch: dispatch })
        if (res) {
            notifySuccessMessage(res.status);
            getEmployeeTaskEfforts()
        }
    }
    const onDeleteItem = (index) => {
        deleteTaskEfforts(listOfTaskEfforts[index].id)
    }
    return (
        <div className="relative flex-auto  ">
            <table className=" bg-transparent border-collapse table-auto  rounded-lg w-full">
                <thead className='bg-gray-200 justify-center items-center'>
                    <tr className='justify-center h-10'>
                        <th
                            key={"valid_from"}
                            className={`text-sm pl-2 text-left text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                            Date
                        </th>
                        <th
                            key={"valid_upto"}
                            className={`text-sm  text-center text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                            {'Duration (Hr)'}
                        </th>
                        <th
                            key={"valid_upto"}
                            className={`text-sm pr-2 text-right text-blueGray-500 font-interVar font-bold w-1/4 font-quicksand font-bold`}>
                            Action
                        </th>

                    </tr>
                </thead>
                <tbody className=" divide-y divide-gray-200 table-fixed">
                    {listOfTaskEfforts.map((item, index) => (
                        <tr key={index} className={`bg-white `} onClick={() => { }}>
                            <td className="">
                                {item.working_date != "" && item.working_duration != "" && item.id ?
                                    <p className=' text-left text-md font-quicksand'>
                                        {formatDate(item.working_date, "DD/MM/YYYY")}
                                    </p>
                                    :
                                    <GidInput
                                        inputType={"date"}
                                        id={`date` + index}
                                        disable={false}
                                        placeholderMsg={"HH:MM"}
                                        className={"w-25 flex "}
                                        value={item.working_date}
                                        onBlurEvent={() => { }}
                                        onTextChange={(e) => {
                                            console.log("SELECTED DATE", e.target.value)
                                            listOfTaskEfforts[index].working_date = e.target.value
                                            setListOfEfforts([...listOfTaskEfforts])
                                        }}></GidInput>
                                }
                            </td>

                            <td className="py-4">
                                {item.working_duration != "" && item.working_date != "" && item.id ?
                                    <p className=' text-center text-md font-quicksand'>
                                        {item.working_duration}
                                    </p> :
                                    <div className=" justify-center items-center flex flex-row">
                                        <GidInput
                                            inputType={"number"}
                                            id='link_description'
                                            disable={false}
                                            placeholderMsg={"HH:MM"}
                                            className={"w-20 flex"}
                                            value={item.working_duration}
                                            onBlurEvent={(e) => {

                                            }}
                                            onTextChange={(e) => {
                                                listOfTaskEfforts[index].working_duration = e.target.value
                                                setListOfEfforts([...listOfTaskEfforts])
                                            }}></GidInput>
                                        <svg
                                            viewBox="0 0 1024 1024"
                                            fill="red"
                                            height="2em"
                                            width="1em"
                                            className="ml-4 cursor-pointer"
                                            onClick={() => onRowRemove(index)}
                                        >
                                            <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
                                        </svg>
                                    </div>
                                }
                            </td>
                            <td className="py-4 text-right justify-end flex mr-4 ">
                                {item.id ?
                                    // <svg
                                    //     viewBox="0 0 1024 1024"
                                    //     fill="currentColor"
                                    //     height="1em"
                                    //     width="1em"
                                    //     className="mr-2"
                                    //     onClick={onEditClick}
                                    // >
                                    //     <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" />
                                    // </svg> 
                                    <svg
                                        viewBox="0 0 1024 1024"
                                        fill="red"
                                        height="2em"
                                        width="1em"
                                        className="ml-4 cursor-pointer"
                                        onClick={() => onDeleteItem(index)}
                                    >
                                        <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
                                    </svg> :

                                    <span className="text-md font-quicksand cursor-pointer text-blue-700 font-medium" onClick={() => {
                                        if (listOfTaskEfforts[index].working_date != "" && listOfTaskEfforts[index].working_duration != "") {
                                            onAddAndSaveNewItem(index)
                                        }
                                    }
                                    }>Add</span>
                                }
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            <span className="text-sm text-blue-500 cursor-pointer" onClick={onAddItemLineClick}>Add row</span>
        </div>
    )
}