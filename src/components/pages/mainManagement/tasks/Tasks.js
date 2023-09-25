import React, { useEffect, useState } from 'react'
import { apiAction } from '../../../../api/api'
import { useNavigate } from 'react-router-dom';
import * as Actions from '../../../../state/Actions';
import { DATE, DURATION, END_TIME, MODULE, PROJECT, START_TIME, TASK, add_effort, svgIcons } from '../../../../utils/Constant';
import PlainButton from '../../../custom/Elements/buttons/PlainButton';
import { getTasksUrl, getTheAddTaskEffortsUrl, get_all_project, get_task } from '../../../../api/urls';
import { getLoginDetails, getWorkspaceInfo } from '../../../../config/cookiesInfo';
import { getTimePeriods } from '../../../../utils/Utils';
import Dropdown from '../../../custom/Dropdown/Dropdown';
import IconInput from '../../../custom/Elements/inputs/IconInput';
import EffortsPopup from './EffortsPopup';
import TasksTimeSheet from './TasksTimeSheet';
import Loader from '../../../custom/Loaders/Loader'

const timePeriods = getTimePeriods()

export default function Tasks() {
  const navigate = useNavigate();
  const dispatch = Actions.getDispatch(React.useContext);
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, selectProject] = useState(null)
  const { work_id } = getWorkspaceInfo();
  const loginDetails = getLoginDetails();
  const [selectedDuration, selectDuration] = useState(timePeriods[1])
  const user_id = loginDetails.user_id
  const [itemDetails, setItemDetails] = useState({ details: null, index: 0 })

  const [modalVisibility, setModalVisibility] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [netWorkCallStatus, setNetworkCallStatus] = useState(false)


  useEffect(() => {
    let URL = getTasksUrl()
    getTaskList(URL)
    console.log("DATA", selectedDuration)
  }, [selectedProject, selectedDuration, searchText])

  useEffect(() => {
    getProjects()
  }, [])


  const getTaskList = async (URL) => {
    const payload = {
      workspace_id: work_id,
      project_id: selectedProject ? selectedProject.project_id : null,
      from_date: selectedDuration ? selectedDuration.dates.from : null,
      to_date: selectedDuration ? selectedDuration.dates.to : null,
      task_description: searchText
    }
    setNetworkCallStatus(true)
    let res = await apiAction({ url: URL, method: 'post', data: payload, navigate: navigate, dispatch: dispatch })
    console.log("RESULTS", res)
    setNetworkCallStatus(false)
    if (res) {
      if (res.success)
        // if(res.result.length > 0){
        setTasks(res.result)
      // }
    }
  }

  const getProjects = async () => {
    let res = await apiAction({
      method: 'get',
      navigate: navigate,
      dispatch: dispatch,
      url: get_all_project(work_id),
    })
    if (res)
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
    return item.list_task_record.reduce((total, currentValue) => total = total + currentValue.working_duration, 0)
  }

  const onSuccessCreate = (data, index) => {
    const is_selected = tasks[index].is_selected
    tasks[index] = data
    tasks[index].is_selected = is_selected
    setTasks([...tasks])
  }

  const onAddEffortClick = (item, index) => {
    setItemDetails({ ...itemDetails, details: item, index: index })
    setModalVisibility(true)
  }

  const onItemClick = (item, index) => {
    tasks[index].is_selected = !tasks[index].is_selected
    setTasks([...tasks])
  }


  return (
    <React.Fragment>
      <div className="bg-screenBackgroundColor flex flex-col justify-between overflow-auto w-full p-1">
        {modalVisibility && <EffortsPopup setState={setModalVisibility} data={itemDetails} onSuccessCreate={onSuccessCreate} />}
        <div className='flex w-full space-x-0 space-y-2 flex-col md:flex-row md:space-x-3 md:space-y-0 mb-3'>
          <div className='md:w-64'>
            <Dropdown options={projects} optionLabel="project_name" value={selectedProject ? selectedProject : { employee_name: 'All Projects' }} setValue={(value) => {
              selectProject(value)
            }} />
          </div>
          <div className='md:w-64'>
            <Dropdown options={timePeriods} optionLabel="title" value={selectedDuration ? selectedDuration : { title: 'Select Option' }} setValue={(value) => {
              selectDuration(value)
            }} />
          </div>
          <div className='flex flex-col md:w-64'>
            <IconInput
              id={"search_task_input"}
              inputType={"text"}
              disable={false}
              className={``}
              value={searchText}
              onTextChange={(event) => { setSearchText(event.target.value) }}
              onBlurEvent={() => { }}
              placeholderMsg={"Search..."}
              icon={svgIcons("fill-gray-600", "search")}
              isRightIcon={true}
            >
            </IconInput>
          </div>
        </div>
        <div>
          {
            tasks.length > 0 &&
            <TasksTimeSheet tasks={tasks} onAddEffortClick={onAddEffortClick} onItemClick={onItemClick}></TasksTimeSheet>
          }

        </div>
        {netWorkCallStatus && <Loader></Loader>}
      </div>
    </React.Fragment>
  )
}
