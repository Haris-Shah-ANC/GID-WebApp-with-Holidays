import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import Card from '../../custom/Elements/Card';
import { apiAction } from '../../../api/api';
import { employee, getTaskListUrl, getTheCalendarViewTasksUrl, post_task, update_task } from '../../../api/urls';
import { getLoginDetails, getWorkspaceInfo } from '../../../config/cookiesInfo';
import { formatDate, formattedDeadline, getCurrentWeekDays, isFormValid, isStartDaySunday, notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils';
import ModelComponent from '../../custom/Model/ModelComponent';
import { add_task } from '../../../utils/Constant';
import Dropdown from '../../custom/Dropdown/Dropdown';
import * as Actions from '../../../state/Actions'
import ButtonWithImage from '../../custom/Elements/buttons/ButtonWithImage';

export default function CalendarView(props) {
    const [days, setDays] = useState([])
    const workspace = getWorkspaceInfo()
    const userInfo = getLoginDetails()
    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [weekNumber, incrementWeek] = useState(0)
    const dispatch = Actions.getDispatch(useContext)

    useEffect(() => {

        const weekDays = getCurrentWeekDays(weekNumber)
        getTaskList(weekDays[0].day.format("YYYY-MM-DD"), weekDays[weekDays.length-1].day.format("YYYY-MM-DD"), weekDays)

    }, [weekNumber])


    const getTaskList = async (fromDate, toDate, weekDays) => {
        let res = await apiAction({ url: getTheCalendarViewTasksUrl(fromDate, toDate, workspace.work_id), method: 'get', 
        // navigate: navigate, 
        dispatch: dispatch, 
        })
        if (res) {
            if(res.results.length > 0){
                putTasksOnDayWise(organizeTasksByDate(res.results), weekDays)
            }else{
                setDays(weekDays)
            }
        }
    }

    const putTasksOnDayWise = (setOfTasksByDay, weekDays) => {
        // console.log("RESPONSE TASKS", setOfTasksByDay, weekDays)
        setDays(weekDays.map(obj => ({ ...obj, tasks:  obj.day.format("YYYY-MM-DD") in setOfTasksByDay ? combineResponseTasksWithDummyTasks(setOfTasksByDay[obj.day.format("YYYY-MM-DD")]) : getEmptyTasks(10) })))   
    }

    const combineResponseTasksWithDummyTasks = (responseTasks) => {
        let listOfTasks = []
        for(let index = 0; index < responseTasks.length; index++){
            listOfTasks.push(responseTasks[index])
        }
        return listOfTasks.concat(responseTasks.length<10 ? getEmptyTasks(10 - responseTasks.length) : [])
    }

    const getEmptyTasks = (length) => {
        let emptyTaskList = []
        for(let i=0; i < length; i++){
            emptyTaskList.push({
                "task_description": "",
            })
        }
        return emptyTaskList
    }

    const organizeTasksByDate = (responseResults) => {
        let tasksGroupByDate = {}
        for (let index=0; index < responseResults.length; index++){
            const date = formatDate(responseResults[index].created_at, "YYYY-MM-DD")
            if(date in tasksGroupByDate){
                tasksGroupByDate[date].push(responseResults[index]) 
            }else{
                tasksGroupByDate[date] = []
                tasksGroupByDate[date].push(responseResults[index])
            }
        }
          return tasksGroupByDate
    }

    const onTaskClick = (item, index) => {
        console.log("ITEM", JSON.stringify(item, 0, 2))
        setFormData({
            task: item.task_description,
            module_id: null,
            work_id: item.workspace,
            status: item.status,
            task_id: item.id,
            project_id: item.project,
            on_hold_reason: item.on_hold_reason,
            dead_line: moment(item.dead_line).format("YYYY-MM-DD HH:mm"),
        });
        setShowModal(add_task)
    }

    const onTaskStatusBtnClick = (item, index) => {
        
    }

    const isToday = (item, defaultColor) => {
        return moment().format("DD-MM") === item.day.format("DD-MM") ? "text-blue-500" : defaultColor
    }
    
  return (
    <React.Fragment>

    <div className='flex flex-col rounded-lg'>
        
        <div className='py-2 px-2 flex justify-between items-center'>

            <span className='font-quicksand font-bold text-2xl text-blue-600'>{days.length > 0 ? days[0].day.format("MMM YYYY") : moment().format("MMM YYYY")}</span>
           
            <div className='flex space-x-5'>
                
                <ButtonWithImage className={'cursor-pointer w-10 h-10 rounded-full border-dark-purple justify-center flex p-0 m-0 group'} title={""} iconStyle={`mr-0`} disabled={false} onButtonClick={() => {incrementWeek(weekNumber-1)}}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className='w-10 h-10 p-[8px] align-baseline fill-white rounded-full bg-blue-500 group-hover:bg-blue-600 shadow-xl' height="1em" viewBox="0 0 320 512">
                  <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>}>
                </ButtonWithImage>

                <ButtonWithImage className={'cursor-pointer w-10 h-10 rounded-full border-dark-purple justify-center flex p-0 m-0 group'} title={""} iconStyle={`mr-0`} disabled={false} onButtonClick={() => {incrementWeek(weekNumber+1)}}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className='w-10 h-10 p-[8px] align-baseline fill-white rounded-full bg-blue-500 group-hover:bg-blue-600 shadow-xl' height="1em" viewBox="0 0 320 512">
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>}>
                </ButtonWithImage>

            </div>

        </div>
        
        

        <div className='flex flex-col md:flex-row bg-white'>
            { days.map((item, index) => {
                return <div className='flex flex-col space-x-0 p-2 space-y-2 w-full md:w-1/6 md:space-x-2 overflow-hidden'>
                            <div className='flex justify-between'>
                                <span className={`text-2xl font-quicksand font-bold ${isToday(item, "text-black")}`}>{item.day.format("DD.MM")}</span>
                                <span className={`text-xl font-quicksand font-semibold ${isToday(item, "text-gray-400")}`}>{item.day.format("ddd")}</span>
                            </div>
                            <div className='h-[2px] bg-black'></div>
                            {
                                item.tasks.map((taskItem, index) => {
                                    return (
                                        <div>
                                            <Card component={<TaskItem item={taskItem} onTaskClick={onTaskClick} onTaskStatusBtnClick={onTaskStatusBtnClick} index={index}></TaskItem>} className></Card>
                                        </div>)
                                })
                            }
                    </div>
                })   
            }
        </div>
        
    </div>
    <ModelComponent showModal={showModal} setShowModal={setShowModal} data={formData} />
    </React.Fragment>
  )
}


const TaskItem = (props) => {
    const {item, onTaskClick, onTaskStatusBtnClick, index} = props
    return (
        <div className='border-b py-2 flex items-center group hover:border-b-blue-300'>
            <span className={`truncate px-1 w-full font-quicksand font-medium text-sm tracking-normal ${item.status === "Completed" ? "line-through decoration-gray-300" : ""}`} onClick={() => {onTaskClick(item,index)}}>{item.task_description}</span>
            {
                item.status === "Completed" ? <svg className='self-end group-hover:fill-gray-500 fill-white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg> :
                // <svg className='self-end group-hover:fill-gray-500 fill-gray-600' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"
                // onClick={() => {onTaskStatusBtnClick()}}/></svg> :
                
        
                <svg className='self-end group-hover:fill-gray-500 fill-white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"
                onClick={() => {onTaskStatusBtnClick()}}/></svg>
                
            }
        </div>
    )

}