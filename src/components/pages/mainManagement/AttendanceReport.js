import React, { useEffect, useState } from 'react'
import Input from '../../custom/Elements/Input'
import moment, { duration } from 'moment/moment'
import { formatDate, getDateRange, isFormValid, notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils'
import {
    getLoginDetails,
    getWorkspaceInfo,
} from '../../../config/cookiesInfo';
import { apiAction, apiActionFormData } from '../../../api/api';
import { getTheAttendanceReportUrl, getTheAttendanceSyncWithRazorPayUrl } from '../../../api/urls';
import no_data_found from '../../../assets/image/no_data_found.svg'
import sync from '../../../assets/image/sync.svg';
import razerpayx from '../../../assets/image/razerpayx.png';
import { WEEKS } from '../../../utils/Constant';

const timePeriods = [
    {name: "Current Month", fromDate: getDateRange("Current Month".toLowerCase(), "YYYY-MM-DD", "start"), toDate: getDateRange("Current Month".toLowerCase(), "YYYY-MM-DD", "end")},
    {name: "Previous Month", fromDate: getDateRange("Previous Month".toLowerCase(), "YYYY-MM-DD", "start"), toDate: getDateRange("Previous Month".toLowerCase(), "YYYY-MM-DD", "end")},
    {name: "Custom", fromDate: null, toDate: null}]

const tableHeaders = ["Employee Name", "Present", "Half Day Present", "Absent", "Week Off", "Present on Week Off", "Half Day Present on Week Off", "Leave", "Unpaid Leave", "Unpaid Half Day"]

export default function AttendanceReport(props) {
    const [selectedTimePeriod, selectTimePeriod] = useState(timePeriods[0])
    const workspace = getWorkspaceInfo()
    const [tableHeaderNames, setTableHeaderNames] = useState(tableHeaders)
    const [attendanceData, setAttendanceData] = useState([])
    const [postData, setPostData] = useState({from_date: selectedTimePeriod.fromDate, to_date: selectedTimePeriod.toDate, work_id: workspace.work_id})

    const onSubmitClick = () => {
        fetchEmployeesAttendanceDetails()
    }
    
    useEffect(() => {
        if(!selectedTimePeriod.name.toLocaleLowerCase().includes("custom")){
            fetchEmployeesAttendanceDetails()
        }
    }, [selectedTimePeriod])

    const fetchEmployeesAttendanceDetails = async () => {
        let validation_data = [
            { key: "work_id", message: 'Workspace field left empty!' },
            { key: "from_date", message: `Description field left empty!` },
            { key: "to_date", message: 'Deadline field left empty!' },
        ]
        const { isValid, message } = isFormValid(postData, validation_data);
        if (isValid) {
            let res = await apiAction({
                method: 'get',
                // navigate: navigate,
                // dispatch: dispatch,
                url: getTheAttendanceReportUrl(postData.from_date, postData.to_date, workspace.work_id),
            })
            if (res.success) {
                let attendanceHeaders = []
                const responseResult = res.result
                if(responseResult.length > 0){
                    for (var item of responseResult[0].attendance){
                        attendanceHeaders.push(item.date)
                    }
                    const dummyObjects = getDummyItems(responseResult[0].start_day_number)
                    for (let i = 0; i <responseResult.length ; i++) {
                        responseResult[i].attendance = dummyObjects.concat(responseResult[i].attendance)
                    }
                    setAttendanceData(res.result.map(obj => ({ ...obj, isOpen: 'false' })))
                }else{
                    setAttendanceData([...[]])
                }
            } else {
                notifyErrorMessage(res.detail)
            }
        } else {
            notifyErrorMessage(message)
        }
    }

    const getDummyItems = (dummyObjCount) => {
        let dummyData = []
        for (let i = 0; i <dummyObjCount-1 ; i++) {
            dummyData.push({attendance: "", isDummyObj: true})
        } 
        console.log("DUMMY DATA", JSON.stringify(dummyData, 0, 2))
        return dummyData
    }

    const syncAttendanceWithRazorPay = async () => {
        // let validation_data = [
        //     { key: "work_id", message: 'Workspace field left empty!' },
        //     { key: "from_date", message: `Description field left empty!` },
        //     { key: "to_date", message: 'Deadline field left empty!' },
        // ]
        // const { isValid, message } = isFormValid(postData, validation_data);
        // if (isValid) {
        //     let res = await apiAction({
        //         method: 'get',
        //         // navigate: navigate,
        //         // dispatch: dispatch,
        //         url: getTheAttendanceSyncWithRazorPayUrl(workspace.work_id, postData.to_date, workspace.work_id),
        //     })
        //     if (res.success) {
        //         notifySuccessMessage(res.detail)
        //     } else {
        //         notifyErrorMessage(res.detail)
        //     }
        // } else {
        //     notifyErrorMessage(message)
        // }
    }

    const hasFromDateAndToDate = () => {
        return postData.from_date.length > 0 && postData.to_date.length > 0
    }

    const validateDate = (fromDate, toDate) => {
        if(formatDate.length > 0 && toDate.length > 0){
            if(moment(fromDate).isAfter(toDate)){
                notifyErrorMessage("From Date Should be less than to date")
                return false
            }else{
                return true
            }
        }else{
            return true
        }

        
    }

const onEmployeeClick = (item, index) => {
    attendanceData[index].isOpen = !attendanceData[index].isOpen
    setAttendanceData([...attendanceData])
}

  return (
    <div className='w-full h-screen'>
        <div className="bg-white rounded-xl flex shadow p-3 flex-wrap justify-between md:space-x-0">
            <div className='flex flex-wrap md:space-x-2 md:space-y-0'>
                <select
                    disabled={false}
                    onChange={(event) => {
                        const selectedItem = JSON.parse(event.target.value)
                        if(!selectedItem.name.toLowerCase().includes("custom")){
                            setPostData({...postData, from_date: selectedItem.fromDate, to_date: selectedItem.toDate})
                        }else{
                            setPostData({...postData, from_date: "", to_date: ""})
                        }
                        selectTimePeriod(selectedItem)

                    }}
                    // value={JSON.stringify(item.role)}
                    className= {`${false?'bg-gray-100 ':''} cursor-pointer border-blueGray-300 text-blueGray-700 rounded font-quicksand font-semibold text-sm`}
                > 
                    {timePeriods.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                            {
                                true && index === 0 ?
                                <option value={JSON.stringify(item)} className="placeholder-blueGray-200 cursor-pointer font-quicksand font-medium">
                                    {item.name}
                                </option>
                                :
                                <option value={JSON.stringify(item)} className="text-gray-600 cursor-pointer font-quicksand font-medium">
                                    {item.name}
                                </option>
                            }
                            </React.Fragment>
                        )
                    }
                    )}
                </select>
                
                {/* <div className='space-x-2 md:ml-2'> */}
                    {
                        selectedTimePeriod.name != "Custom" && 
                        <div className='flex space-x-2 self-center justify-center items-center pl-2 font-quicksand font-medium text-sm'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill='#858796'>
                                <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"/></svg>
                            <span className='text-gray-600 font-bold'>From</span>
                                <span className='self-center'>{formatDate(selectedTimePeriod.fromDate, "DD/MM/YYY")}</span>
                                <span className='text-gray-600 font-bold'>To</span>
                                <span className='self-center'>{formatDate(selectedTimePeriod.toDate, "DD/MM/YYYY")}</span>
                        </div>
                    }
                    {
                        selectedTimePeriod.name === "Custom" && 
                        <div className='flex flex-wrap mt-2 space-x-0 space-y-2 md:mt-0 md:space-x-2 md:space-y-0'>
                            <Input
                                id="datetime"
                                name="datetime"
                                type="date"
                                value={postData.from_date}
                                onChange={(e) => {
                                    if(validateDate(e.target.value, postData.to_date)){
                                        setPostData({...postData, from_date: e.target.value})}   
                                    }
                                }
                            />
                            <Input
                                id="date"
                                name="datetime"
                                type="date"
                                value={postData.to_date}
                                onChange={(e) => {
                                    if(validateDate(postData.from_date, e.target.value)){
                                        setPostData({...postData, to_date: e.target.value})}}
                                    }
                            />
                            
                            <button className='font-quicksand font-bold text-sm text-white rounded-md border bg-blue-600 px-4 py-2 my-2 md:mt-0' onClick={() => {onSubmitClick()}}>Submit</button>
                        </div>
                }
                
                {/* </div> */}
                
            </div>
            
            <button className={`flex font-quicksand font-bold text-sm text-white rounded-md border ${hasFromDateAndToDate() ? "bg-blue-600": "bg-blue-400"} items-center`} disabled={hasFromDateAndToDate() ? false : true} onClick={() => {syncAttendanceWithRazorPay()}}>
                <div className={`${hasFromDateAndToDate() ? "bg-blue-700": "bg-blue-500"} h-full rounded-l-lg`}>
                    <img src={sync} alt='' className='w-5 mx-2 h-full'></img>
                </div>
                <span className='mr-2'>Sync To Razorpay</span>
                <img src={razerpayx} alt='' className='w-5 h-5 mr-2'></img>
            </button>
                
            
        </div>
        { attendanceData.length > 0&&
            <div className="px-0 py-4 block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse rounded-xl shadow-lg">
                    <thead>
                        <tr className='w-full'>
                        <th
                            key={"Sr No."}
                            className={`px-3 min-w-[110px] max-w-[110px] text-sm text-left bg-white text-blueGray-500 border-blueGray-200 rounded-sm font-quicksand font-bold`}> 
                            {"Sr No."}
                        </th> 
                            {tableHeaderNames.map((item, index) => {
                                return (
                                    <th
                                        key={index}
                                        className={`px-3 min-w-[110px] max-w-[110px] text-sm text-left bg-white text-blueGray-500 border-blueGray-200 rounded-sm font-quicksand font-bold`}> 
                                        {item}
                                    </th>                                    
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        { attendanceData.map((item, index) => {
                                return (
                                   <>
                                     <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-blue-100`} onClick={() => {onEmployeeClick(item, index)}}>
                                        {/* <td><i class="w-auto fa-solid fa-angle-down mr-2"></i></td> */}
                                        <td className="px-2 py-4 ">
                                            <div className='flex items-center w-full '>
                                                <span className="font-quicksand font-medium text-sm"></span>
                                                <i class="w-auto fa-solid fa-angle-down mr-3"></i>
                                                    {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-quicksand font-medium text-sm align-top">{item.total_count[0].employee__employee_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-quicksand font-medium text-sm">{item.total_count[0].present_count}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-quicksand font-medium text-sm">{item.total_count[0].half_day_present}</div>
                                        </td>
                                        <td className="px-6 py-4 ">
                                            <div className={`font-quicksand font-medium text-sm`}>
                                                {item.total_count[0].absent_count}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-quicksand font-medium text-sm">
                                                {item.total_count[0].week_off}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-quicksand font-medium text-sm">
                                                {item.total_count[0].week_off_present}
                                                </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-quicksand font-medium text-sm">{item.total_count[0].half_day_present_on_week_off}</div>
                                        </td>
                                        <td className="px-6 py-4 ">
                                            <div className={`font-quicksand font-medium text-sm`}>
                                                {item.total_count[0].leave_count}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-quicksand font-medium text-sm">
                                                {item.total_count[0].unpaid_leave_count}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-quicksand font-medium text-sm">
                                                {item.total_count[0].unpaid_half_day_count}
                                                </div>
                                        </td>
                                    </tr>
                                    { !item.isOpen &&
                                        <tr>
                                        <td colSpan={11}>
                                            <div  class="grid grid-cols-7 gap-4 mx-10 my-2">
                                                {
                                                    WEEKS.map((weekItem, wIndex) => {
                                                        return <div className='font-quicksand font-bold text-center text-gray-500 text-sm'>
                                                            {weekItem}
                                                        </div>
                                                    })
                                                }
                                            {
                                            item.attendance.map((attendanceItem, index) => {
                                                return (
                                                    <td className="px-3 whitespace-nowrap">
                                                        <div class={`flex flex-col justify-center items-center ${attendanceItem.isDummyObj ? "bg-white" : "bg-blue-100"} rounded-md py-1`}>
                                                                <div className='font-quicksand font-bold text-gray-500 text-sm px-2 py-[2px]'>{attendanceItem.date}</div>
                                                                <div className='font-quicksand font-bold text-sm'>{attendanceItem.attendance}</div>
                                                        </div>
                                                       </td>
                                                    );
                                                })
                                            } 
                                            </div>
                                            </td>
                                        
                                    </tr>
                                    }
                                   </>
                                );
                            })
                        }
                        
                    </tbody>
                </table>
            </div> 
        }

        {attendanceData.length === 0 && <div className='flex w-full h-full mt-2 justify-center'>
            <div>
                <img src={no_data_found} alt="" className='h-96 w-96'></img>
            </div>
        </div>}
    </div>
  )
}
