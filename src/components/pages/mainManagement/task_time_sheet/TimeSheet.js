import React, { useEffect, useState } from 'react'
import { apiAction } from '../../../../api/api'
import { useNavigate } from 'react-router-dom';
import * as Actions from '../../../../state/Actions';
import { DURATION, END_TIME, START_TIME, TASK } from '../../../../utils/Constant';
import PlainButton from '../../../custom/Elements/buttons/PlainButton';
import { get_all_project, get_task } from '../../../../api/urls';
import { getLoginDetails, getWorkspaceInfo } from '../../../../config/cookiesInfo';
import { formatDate } from '../../../../utils/Utils';
import Dropdown from '../../../custom/Dropdown/Dropdown';

export default function TimeSheet() {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);
    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [selectedProject, selectProject] = useState(null)
    const { work_id } = getWorkspaceInfo();
    const loginDetails = getLoginDetails();
    const user_id = loginDetails.user_id
    

    useEffect(() => {
        let URL = get_task() + `?created_at__date__gte=&created_at__date__lte=&workspace=${work_id}&employee_id=${user_id}&project_id=${selectedProject ? selectedProject.project_id : ""}`
        getTaskList(URL)
    }, [selectedProject])

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

  return (
    <React.Fragment>
        <div className="bg-screenBackgroundColor flex flex-col justify-between overflow-auto w-full m-2">
            <div className='flex w-72 my-2'>
                <Dropdown options={projects} optionLabel="project_name" value={selectProject ? selectedProject : { employee_name: 'All Projects' }} setValue={(value) => {
                    selectProject(value)
                        }} />
            </div>
        <table className=" bg-transparent w-full">
          <thead className='bg-gray-200 px-10 justify-center items-center'>
            <tr className='h-10'>
              <th
                key={TASK}
                className={`text-sm p-3 text-left text-blueGray-500 font-interVar font-bold `}>
                {TASK}
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

              

              {/* <th
                key={DURATION}
                className={`text-sm p-3 text-center text-blueGray-500 font-interVar font-bold w-24`}>
                <IconInput
                    id={"clock_in_time"}
                    inputType={"time"}
                    disable={false}
                    className={``}
                    value={workspaceFormData.office_start_time ? workspaceFormData.office_start_time : ""}
                    onTextChange={(e) => setWorkspaceFormData((previous) => ({ ...previous, office_start_time: e.target.value }))}
                    onBlurEvent={() => {}}
                    placeholder={""}
                    isRightIcon={true}
                    >
                </IconInput>
              </th> */}
              
            </tr>
          </thead>
          <tbody className=" divide-y divide-gray-200 table-fixed">
            {
                tasks.map((item, index) => {
                    return <tr key={1} className={`bg-white `} onClick={() => { }}>
                    <td className="p-3">
                      <p className='text-sm text-left'>{item.detailed_description}
                      </p>
                    </td>
                    <td className="py-3">
                      <p className='text-center text-sm'>{formatDate(item.created_at, "MMM DD HH:mm")}
                      </p>
                    </td>
                    <td className="py-3">
                      <p className='text-sm text-center'>{formatDate(item.dead_line, "MMM DD HH:mm")}
                      </p>
                    </td>
                    <td className="py-3">
                      <p className='text-sm text-center'>{"-"}
                      </p>
                    </td>
                  </tr>
                })
            }
          </tbody>
        </table>
        </div>
    </React.Fragment>
  )
}
