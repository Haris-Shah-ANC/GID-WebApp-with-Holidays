import React, { useEffect, useState } from 'react'
import { apiAction } from '../../../../api/api'
import { useNavigate } from 'react-router-dom';
import * as Actions from '../../../../state/Actions';
import { DATE, DURATION, END_TIME, MODULE, PROJECT, START_TIME, TASK, svgIcons } from '../../../../utils/Constant';
import PlainButton from '../../../custom/Elements/buttons/PlainButton';
import { getTasksUrl, getTheAddTaskEffortsUrl, get_all_project, get_task } from '../../../../api/urls';
import { getLoginDetails, getWorkspaceInfo } from '../../../../config/cookiesInfo';
import { formatDate, getTimePeriods } from '../../../../utils/Utils';
import Dropdown from '../../../custom/Dropdown/Dropdown';
import IconInput from '../../../custom/Elements/inputs/IconInput';
import GidInput from '../../../custom/Elements/inputs/GidInput';
import EffortDatePopup from './EffortDatePopup';

const timePeriods = getTimePeriods()

export default function Tasks() {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);
    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [selectedProject, selectProject] = useState(null)
    const { work_id } = getWorkspaceInfo();
    const loginDetails = getLoginDetails();
    const [selectedDuration, selectDuration] = useState(timePeriods[0])
    const user_id = loginDetails.user_id
    const [itemDetails, setItemDetails] = useState(null)
    

    useEffect(() => {
        let URL = getTasksUrl()
        // if(selectedProject && selectedDuration){
          getTaskList(URL)
        // }
    }, [selectedProject, selectedDuration])

    useEffect(() => {
        getProjects()
    }, [])

    const getTaskList = async (URL) => {
      const payload = {
        workspace_id: work_id, 
        project_id: selectedProject ? selectedProject.project_id : null, 
        from_date: selectedDuration ? selectedDuration.dates.from : null, 
        to_date: selectedDuration ? selectedDuration.dates.to : null
      }
        let res = await apiAction({ url: URL, method: 'post',data: payload, navigate: navigate, dispatch: dispatch })
        console.log("RESULTS", res)
        if (res) {
          if(res.result.length > 0){
            setTasks(res.result)
          }
        }
    }

    const getProjects = async () => {
        let res = await apiAction({
            method: 'get',
            navigate: navigate,
            dispatch: dispatch,
            url: get_all_project(work_id),
        })
        if (res.success) {
            setProjects([{ project_name: 'Select project' }, ...res.result])
            // selectProject(res.result[0])
        }
    }

    const updateDuration = async (index) => {
      // const payload = {workspace_id: work_id, task_id: tasks[index].id, hour: "", working_date: ""}
      // let res = await apiAction({ url: getTheAddTaskEffortsUrl(), method: 'post', data: payload,navigate: navigate, dispatch: dispatch })
      //   console.log("RESULTS", res)
      //   if (res) {
      //       setTasks(res.results)
      //   }
    }

    const calculateDuration = (item) => {
      return item.list_task_record.reduce((total,currentValue) =>  total = total + currentValue.working_duration , 0 )
    }

    const onClose = () => {
      setItemDetails(null)
    }

    const onAdd = () => {

    }

  return (
    <React.Fragment>
        <div className="bg-screenBackgroundColor flex flex-col justify-between overflow-auto w-full p-1">
          <div className='flex w-full space-x-3 mb-3'>
              <div className='w-72'>
              <Dropdown options={projects} optionLabel="project_name" value={selectProject ? selectedProject : { employee_name: 'All Projects' }} setValue={(value) => {
                  selectProject(value)
                      }} />
              </div>
              <div className='w-72'>
              <Dropdown options={timePeriods} optionLabel="title" value={selectDuration ? selectDuration : { title: 'Select Option' }} setValue={(value) => {
                  selectDuration(value)
                      }} />
              </div>        
          </div>
        <div>
          {
            tasks.length > 0 &&
              <table className=" bg-transparent w-full">
            <thead className='bg-gray-200 px-10 justify-center items-center'>
              <tr className='h-10'>
                <th
                  key={TASK}
                  className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold w-full font-quicksand`}>
                  {TASK}
                </th>

                <th
                  key={PROJECT}
                  className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold w-36 font-quicksand`}>
                  {PROJECT}
                </th>

                <th
                  key={MODULE}
                  className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold w-36 font-quicksand`}>
                  {MODULE}
                </th>


                <th
                  key={START_TIME}
                  className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold w-32 font-quicksand`}>
                  {START_TIME}
                </th>

                <th
                  key={END_TIME}
                  className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold w-32 font-quicksand`}>
                  {END_TIME}
                </th>

                
                <th
                  key={DURATION}
                  className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold w-24 font-quicksand`}>
                  {DURATION}
                </th>
                
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200 table-fixed">
              {
                  tasks.map((item, index) => {
                      return <>
                        <tr key={1} className={`bg-white`} >
                          <td className="p-3" >
                            <div className='flex bg items-center' >
                              <div onClick={() => {
                                setItemDetails(item)
                                }} className='relative'>
                                {svgIcons("fill-black w-4 h-4 mr-2 cursor-pointer","timer")}
                              </div>
                              {itemDetails && <EffortDatePopup onClose={onClose} onAdd={onAdd}></EffortDatePopup>}
                              <p className='text-sm text-left break-words line-clamp-2 min-w-[320px] font-quicksand w-full cursor-pointer hover:font-semibold' onClick={() => { 
                                  tasks[index].is_selected = !tasks[index].is_selected
                                  setTasks([...tasks])
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
                          {item.list_task_record.length > 0 && <div class="grid grid-cols-10 gap-1 mx-5 my-2">
                              {
                                  item.list_task_record.map((workDetails, index) => {
                                      return (
                                          <td className="px-0 whitespace-nowrap">
                                              <div class={`flex flex-col bg-white shadow py-2 space-x-2 items-center`}>
                                                <p className='text-sm text-blueGray-600 font-semi-bold'>{formatDate(workDetails.working_date, "D-MMM-YYYY")}</p>
                                                <p className='text-md'>{workDetails.working_duration} hrs.</p>
                                              </div>
                                          </td>
                                      );
                                  })
                              }
                          </div>}
                          {/* <div className='justify-center items-center flex my-2'>
                            <table className=" bg-transparent table-fixed w-1/2">
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

                                  <th
                                    key={MODULE}
                                    className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold`}>
                                    {MODULE}
                                  </th>
                                </tr>
                              </thead>
                              <tbody className=" divide-y divide-gray-200 table-fixed">
                                <tr className='h-10'>
                                    <th
                                      key={TASK}
                                      className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold`}>
                                      {TASK}
                                    </th>

                                    <th
                                      key={PROJECT}
                                      className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold`}>
                                      {PROJECT}
                                    </th>

                                    <th
                                      key={MODULE}
                                      className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold`}>
                                      {MODULE}
                                    </th>
                                  </tr>
                              </tbody>
                            </table>
                          </div> */}
                          
                      </td>

                      </tr>}
                    </>
                  })
              }
            </tbody>
          </table>
          }
          
        </div>
        </div>
    </React.Fragment>
  )
}
