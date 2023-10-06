import React, { useState } from 'react'
import { DATE, DURATION, EMPLOYEE, END_TIME, MODULE, PROJECT, START_TIME, TASK, svgIcons } from '../../../../utils/Constant'
import { formatDate, notifyErrorMessage, notifySuccessMessage } from '../../../../utils/Utils'
import { twMerge } from 'tailwind-merge'
import { getDeleteTaskEffortsUrl } from '../../../../api/urls'
import { apiAction } from '../../../../api/api'
import { useNavigate } from 'react-router-dom'
import EffortsComponent from '../../../custom/EffortsComponent'
import { getLoginDetails } from '../../../../config/cookiesInfo'

export default function TasksTimeSheet(props) {
    const { tasks, onAddEffortClick, onItemClick, onDeleteEffort, onEffortItemClick, onEffortUpdate, fromAlerts, isAllEmployeeFilter } = props
    const navigate = useNavigate()
    const loginDetails = getLoginDetails();

    const user_id = loginDetails.user_id

    const [isEffortsTableVisible, setEffortsTableVisible] = useState(false)
    const [selectedTask, selectTask] = useState(null)

    const calculateDuration = (item) => {
        return item.list_task_record.reduce((total, currentValue) => total = total + currentValue.working_duration, 0)
    }

    const deleteTaskEfforts = async (data, workspace_id, effortIndex, taskIndex) => {
        onDeleteEffort(taskIndex, effortIndex, data)
    }

    const onEffortEditClick = (data, taskIndex, effortIndex) => {
        onEffortItemClick(data, taskIndex, effortIndex)
    }

    return (
        <table className=" bg-transparent w-full">
            <thead className='bg-gray-200 px-10 justify-center items-center'>
                <tr className='h-10 flex-auto w-full'>
                    <TableHeader className={`text-left w-auto`} title={TASK}></TableHeader>
                    <TableHeader className={`text-center w-36`} title={EMPLOYEE}></TableHeader>
                    <TableHeader className={`text-center w-36`} title={PROJECT}></TableHeader>
                    <TableHeader className={`text-center w-36`} title={MODULE}></TableHeader>
                    <TableHeader className={`text-center w-32`} title={START_TIME}></TableHeader>
                    <TableHeader className={`text-center w-32`} title={END_TIME}></TableHeader>
                    <TableHeader className={`text-center w-24`} title={DURATION}></TableHeader>
                </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200 table-fixed">
                {
                    tasks.map((item, index) => {
                        return <TableRow loggedInUserId={user_id} onEffortUpdate={onEffortUpdate} onAddEffortClick={onAddEffortClick} onItemClick={onItemClick} item={item} index={index} deleteTaskEfforts={deleteTaskEfforts} onEffortEditClick={onEffortEditClick}></TableRow>
                        // if (fromAlerts) {
                        //     if (parseFloat(item.total_working_duration) == 0)
                        //         return <TableRow isAllEmployeeFilter={isAllEmployeeFilter} loggedInUserId={user_id} onEffortUpdate={onEffortUpdate} onAddEffortClick={onAddEffortClick} onItemClick={onItemClick} item={item} index={index} deleteTaskEfforts={deleteTaskEfforts} onEffortEditClick={onEffortEditClick}></TableRow>
                        // } else {
                        //     return <TableRow loggedInUserId={user_id} onEffortUpdate={onEffortUpdate} onAddEffortClick={onAddEffortClick} onItemClick={onItemClick} item={item} index={index} deleteTaskEfforts={deleteTaskEfforts} onEffortEditClick={onEffortEditClick}></TableRow>
                        // }
                    })
                }
            </tbody>
        </table>
    )
}


function TableHeader(props) {
    const { title, className } = props
    const tailwindMergedCSS = twMerge(`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold w-full font-quicksand`, className)
    return <th
        key={title}
        className={tailwindMergedCSS}>
        {title}
    </th>
}

function TableRow(props) {
    const { onAddEffortClick, item, index, deleteTaskEfforts, onEffortEditClick, onEffortUpdate, onItemClick, loggedInUserId, isAllEmployeeFilter } = props

    const calculateDuration = (item) => {
        return item.list_task_record.reduce((total, currentValue) => total = parseFloat(total) + parseFloat(currentValue.working_duration), 0)
    }

    return <>

        <tr key={1} className={`${item.is_selected ? "bg-blue-100" : "bg-white"}`} >
            <td className="p-3" >
                <div className='flex  items-center' >
                    <p className={`text-sm text-left break-words line-clamp-2 min-w-[320px] ${item.employee_id == loggedInUserId ? item.is_selected ? 'font-semibold' : 'hover:font-semibold cursor-pointer' : ''} font-quicksand w-full   `} onClick={() => {
                        if (loggedInUserId == item.employee_id) {
                            onItemClick(item, index)
                        }

                    }}>{item.task_description}
                    </p>
                </div>
            </td>

            <td className="py-3" >
                <p className='text-center text-sm  w-36 truncate mx-1 font-quicksand'>{item.employee_name}
                </p>
            </td>


            <td className="py-3">
                <p className='text-center text-sm w-36 truncate mx-1 font-quicksand'>{item.project_name}
                </p>
            </td>

            <td className="py-3">
                <p className='text-sm text-center w-36 truncate mx-1 font-quicksand'>{item.module_name ? item.module_name : "-"}
                </p>
            </td>
            <td className="py-3">
                <p className='text-center text-sm w-32 truncate mx-1 font-quicksand'>{formatDate(item.created_at, "MMM DD HH:mm")}
                </p>
            </td>
            <td className="py-3">
                <p className='text-sm text-center w-32 truncate mx-1 font-quicksand'>{formatDate(item.dead_line, "MMM DD HH:mm")}
                </p>
            </td>
            <td className="py-3">

                <p className={`text-sm text-center w-32 truncate mx-1 font-quicksand font-bold ${item.total_working_duration == 0 ? 'text-orange-400' : ""}`}>{`${item.total_working_duration} hrs.`}
                </p>
            </td>


        </tr>

        {item.is_selected &&
            <div className=''>
                {/* <tr className='bg-red-100 w-full' key={2}> */}
                {/* <td className=' '> */}
                <div className='w-[45vh] py-3'>
                    <EffortsComponent data={item} onEffortUpdate={(total) => onEffortUpdate(total)} isVisible={item.is_selected} setUpdateEffortsStatus={() => { }} />
                </div>
                {/* </td> */}
                {/* </tr > */}
            </div>
        }


    </>
}
