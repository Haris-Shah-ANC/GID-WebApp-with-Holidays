import React, { useEffect, useState } from 'react'
import { apiAction } from '../../../../api/api'
import { useNavigate } from 'react-router-dom';
import * as Actions from '../../../../state/Actions';
import { DATE, DURATION, END_TIME, MODULE, PROJECT, START_TIME, TASK, svgIcons } from '../../../../utils/Constant';
import PlainButton from '../../../custom/Elements/buttons/PlainButton';
import { getTheAddTaskEffortsUrl, get_all_project, get_task } from '../../../../api/urls';
import { getLoginDetails, getWorkspaceInfo } from '../../../../config/cookiesInfo';
import { formatDate, getTimePeriods } from '../../../../utils/Utils';
import Dropdown from '../../../custom/Dropdown/Dropdown';
import IconInput from '../../../custom/Elements/inputs/IconInput';
import GidInput from '../../../custom/Elements/inputs/GidInput';

export default function Tasks() {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);
    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [selectedProject, selectProject] = useState(null)
    const { work_id } = getWorkspaceInfo();
    const loginDetails = getLoginDetails();
    const [selectedDuration, selectDuration] = useState(null)
    const user_id = loginDetails.user_id
    

    useEffect(() => {
        let URL = get_task() + `?created_at__date__gte=${selectedDuration ? selectedDuration.from : ""}&created_at__date__lte=${selectedDuration ? selectedDuration.to : ""}&workspace=${work_id}&employee_id=${user_id}&project_id=${selectedProject ? selectedProject.project_id : ""}`
        getTaskList(URL)
    }, [selectedProject, selectedDuration])

    useEffect(() => {
        getProjects()
    }, [])

    const getTaskList = async (URL) => {
        let res = await apiAction({ url: URL, method: 'get', navigate: navigate, dispatch: dispatch })
        console.log("RESULTS", res)
        if (res) {
            setTasks(res.results)
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
              <Dropdown options={getTimePeriods()} optionLabel="title" value={selectDuration ? selectDuration : { title: 'Select Option' }} setValue={(value) => {
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
                  className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold w-full`}>
                  {TASK}
                </th>

                <th
                  key={PROJECT}
                  className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold w-36`}>
                  {PROJECT}
                </th>

                <th
                  key={MODULE}
                  className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold w-36`}>
                  {MODULE}
                </th>


                <th
                  key={START_TIME}
                  className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold w-32`}>
                  {START_TIME}
                </th>

                <th
                  key={END_TIME}
                  className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold w-32`}>
                  {END_TIME}
                </th>

                
                <th
                  key={DURATION}
                  className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold w-24`}>
                  {DURATION}
                </th>
                
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200 table-fixed">
              {
                  tasks.map((item, index) => {
                      return <>
                        <tr key={1} className={`bg-white `} onClick={() => { }}>
                          <td className="p-3">
                            <div className='flex bg items-center' >
                              <div onClick={() => {}}>{svgIcons("fill-black w-4 h-4 mr-2 cursor-pointer","timer")}</div>
                              <p className='text-sm text-left break-words line-clamp-2 min-w-[320px]'>{item.detailed_description}
                              </p>
                            </div>
                          </td>
                          <td className="py-3">
                            <p className='text-center text-sm w-36 truncate mx-1'>{item.project_name}
                            </p>
                          </td>
                          <td className="py-3">
                            <p className='text-sm text-center w-36 truncate mx-1'>{item.module_name}
                            </p>
                          </td>
                          <td className="py-3">
                            <p className='text-center text-sm w-32 truncate mx-1'>{formatDate(item.created_at, "MMM DD HH:mm")}
                            </p>
                          </td>
                          <td className="py-3">
                            <p className='text-sm text-center w-32 truncate mx-1'>{formatDate(item.dead_line, "MMM DD HH:mm")}
                            </p>
                          </td>
                          <td className="py-3">
                          <p className='text-sm text-center w-32 truncate mx-1'>{DURATION}
                            </p>
                              {/* <GidInput 
                                inputType={"text"} 
                                id={"last_name"}
                                disable={false} 
                                className={"w-32"} 
                                value={""} 
                                onBlurEvent={() => updateDuration(index)}
                                placeholderMsg = "Enter last name"
                                onTextChange={(event) => ""}>
                              </GidInput> */}
                          </td>
                      </tr>

                      <tr>
                      <td colSpan={6}>
                          <div class="grid grid-cols-10 gap-1 mx-5 my-2">
                              {
                                  [1,2,3, 4,5,6,7,8,9,10,11,12].map((attendanceItem, index) => {
                                      return (
                                          <td className="px-0 whitespace-nowrap">
                                              <div class={`flex flex-col bg-white rounded-md py-2 space-x-2 items-center`}>
                                                <p className='text-sm'>{"2023-09-21"}</p>
                                                <p className='text-sm'>{"8hrs."}</p>
                                              </div>
                                          </td>
                                      );
                                  })
                              }
                          </div>
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

                      </tr>
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
