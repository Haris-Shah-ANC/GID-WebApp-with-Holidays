import React from 'react'
import { DATE, DURATION, END_TIME, MODULE, PROJECT, START_TIME, TASK, svgIcons } from '../../../../utils/Constant'
import { formatDate } from '../../../../utils/Utils'
import { twMerge } from 'tailwind-merge'

export default function TasksTimeSheet(props) {
    const { tasks, onAddEffortClick, onItemClick } = props

    const calculateDuration = (item) => {
        return item.list_task_record.reduce((total, currentValue) => total = total + currentValue.working_duration, 0)
    }

    return (
        <table className=" bg-transparent w-full">
            <thead className='bg-gray-200 px-10 justify-center items-center'>
                <tr className='h-10'>
                    <TableHeader className={`text-left w-full`} title={TASK}></TableHeader>
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
                        return <TableRow onAddEffortClick={onAddEffortClick} onItemClick={onItemClick} item={item} index={index}></TableRow>
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
    const { onAddEffortClick, onItemClick, item, index } = props

    const calculateDuration = (item) => {
        return item.list_task_record.reduce((total, currentValue) => total = total + currentValue.working_duration, 0)
    }

    return <>
        <tr key={1} className={`bg-white`} >
            <td className="p-3" >
                <div className='flex bg items-center' >
                    <div onClick={() => { onAddEffortClick(item, index) }}>
                        {svgIcons("fill-black w-4 h-4 mr-2 cursor-pointer", "timer")}
                    </div>
                    <p className='text-sm text-left break-words line-clamp-2 min-w-[320px] font-quicksand w-full cursor-pointer hover:font-semibold' onClick={() => {
                        onItemClick(item, index)
                    }}>{item.task_description}
                    </p>
                </div>
            </td>
            <td className="py-3">
                <p className='text-center text-sm w-36 truncate mx-1 font-quicksand'>{item.project_name}
                </p>
            </td>
            <td className="py-3">
                <p className='text-sm text-center w-36 truncate mx-1 font-quicksand'>{item.module_name}
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
                <p className='text-sm text-center w-32 truncate mx-1 font-quicksand font-bold'>{`${calculateDuration(item)}hrs.`}
                </p>
            </td>
        </tr>

        {item.is_selected && <tr>
            <td colSpan={6}>
                {item.list_task_record.length > 0 ?
                    <div className='justify-center items-center flex my-2'>
                        <table className=" bg-transparent table-fixed w-full md:w-1/2">
                            <thead className='bg-gray-200 px-10 justify-center items-center'>
                                <tr className='h-10'>
                                    <th
                                        key={DATE}
                                        className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold`}>
                                        {DATE}
                                    </th>

                                    <th
                                        key={DURATION}
                                        className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold`}>
                                        {DURATION}
                                    </th>

                                </tr>
                            </thead>
                            <tbody className=" divide-y divide-gray-200 table-fixed">
                                {
                                    item.list_task_record.map((workDetails, index) => {
                                        return <tr className='h-10'>
                                            <th
                                                // key={TASK}
                                                className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold`}>
                                                {formatDate(workDetails.working_date, "D-MMM-YYYY")}
                                            </th>

                                            <th
                                                // key={}
                                                className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold`}>
                                                {workDetails.working_duration} hrs.
                                            </th>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div> :
                    <div className='flex justify-center'>
                        <p className='text-sm font-quicksand font-semibold p-3'>No efforts were added.</p>
                    </div>
                }

            </td>

        </tr>}
    </>
}