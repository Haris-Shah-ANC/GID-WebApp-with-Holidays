import React, { useEffect, useState } from 'react'
import { apiAction } from '../../../../api/api'
import { useNavigate } from 'react-router-dom';
import * as Actions from '../../../../state/Actions';
import { ALERTS, DATE, DURATION, END_TIME, MODULE, PROJECT, START_TIME, TASK, add_effort, svgIcons } from '../../../../utils/Constant';
import PlainButton from '../../../custom/Elements/buttons/PlainButton';
import { employee, getDeleteTaskEffortsUrl, getTasksUrl, getTheAddTaskEffortsUrl, getTheUpdateTaskEffortsUrl, get_all_project, get_task } from '../../../../api/urls';
import { getLoginDetails, getWorkspaceInfo } from '../../../../config/cookiesInfo';
import { getTimePeriods, notifyErrorMessage, notifySuccessMessage } from '../../../../utils/Utils';
import Dropdown from '../../../custom/Dropdown/Dropdown';
import IconInput from '../../../custom/Elements/inputs/IconInput';
import EffortsPopup from './EffortsPopup';
import TasksTimeSheet from './TasksTimeSheet';
import Loader from '../../../custom/Loaders/Loader'
import moment from 'moment';
import CustomDateRengePicker from '../../../custom/Elements/CustomDateRengePicker';
import CustomDatePicker from '../../../custom/Elements/CustomDatePicker';

const timePeriods = getTimePeriods()

export default function Tasks(props) {
  const navigate = useNavigate();
  let workspace = getWorkspaceInfo(navigate)
  const dispatch = Actions.getDispatch(React.useContext);
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, selectProject] = useState(null)
  const { work_id } = getWorkspaceInfo();
  const loginDetails = getLoginDetails();
  const [selectedDuration, selectDuration] = useState(timePeriods[1])
  const user_id = loginDetails.user_id
  const [itemDetails, setItemDetails] = useState({ details: null, index: 0, editDetails: null })
  const [modalVisibility, setModalVisibility] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [netWorkCallStatus, setNetworkCallStatus] = useState(false)
  const [selectedTask, selectTask] = useState({ item: null, index: 0 })
  const [employeeList, setEmployeeList] = useState([{ employee_name: "All Employee" }])
  const [selectedEmployee, selectEmployee] = useState({ employee_name: "All Employee" })
  const [customPeriod, setCustomPeriod] = useState({ fromDate: moment().format("YYYY-MM-DD"), toDate: moment().format("YYYY-MM-DD") })
  useEffect(() => {
    let URL = getTasksUrl()
    getTaskList(URL)
  }, [selectedProject, selectedDuration, searchText, selectedEmployee, customPeriod])

  useEffect(() => {
    getProjects()
    getEmployees()

  }, [])
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11)
  });

  const handleValueChange = newValue => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  const getTaskList = async (URL) => {
    const payload = {
      workspace_id: work_id,
      project_id: selectedProject ? selectedProject.project_id ? selectedProject.project_id : null : null,
      task_description: searchText,
      employee_id: selectedEmployee && selectedEmployee.id
    }
    if (selectedDuration.title == "Custom") {
      payload.from_date = customPeriod.fromDate
      payload.to_date = customPeriod.toDate
    } else {
      payload.from_date = selectedDuration ? selectedDuration.dates.from : null
      payload.to_date = selectedDuration ? selectedDuration.dates.to : null
    }

    setNetworkCallStatus(true)
    let res = await apiAction({ url: URL, method: 'post', data: payload, navigate: navigate, dispatch: dispatch })
      .then((response) => {
        if (response) {
          if (response.success)
            // if(res.result.length > 0){
            // var sorted ;= response.results.sort((a, b) => a.employee_name.localeCompare(b.employee_name, undefined, {}));

            setTasks(res.result)
          // }
        }
      })
      .catch((error) => {
        console.log("ERROR", error)
      })
    setNetworkCallStatus(false)
  
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
        setProjects([{ project_name: 'All Projects' }, ...res.result])
        // selectProject(res.result[0])
      }
  }
  const getEmployees = async () => {
    let response = await apiAction({
      url: employee(work_id),
      method: 'get',
      navigate: navigate,
      dispatch: dispatch,
    })
    if (response) {
      setEmployeeList([{ employee_name: "All Employee" }, ...response.results])
      selectEmployee(response.results.find((item) => item.id == user_id))
    }
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
    setItemDetails({ ...itemDetails, details: item, index: index, editDetails: null })
    setModalVisibility(true)
  }

  const onItemClick = (item, index) => {
    tasks[index].is_selected = !tasks[index].is_selected
    selectTask({ item: item, index: index })
    setTasks([...tasks])

  }

  const onDeleteEffort = async (taskIndex, effortIndex, data) => {
    let res = await apiAction({ url: getDeleteTaskEffortsUrl(), method: 'post', data: { task_record_id: data.id, workspace_id: work_id }, navigate: navigate })
    if (res) {
      if (res.success) {
        notifySuccessMessage(res.status);
        tasks[taskIndex].list_task_record.splice(effortIndex, 1)
        setTasks([...tasks])
      } else {
        notifyErrorMessage(res.status)
      }
      // getEmployeeTaskEfforts()
    }

  }

  const onEffortItemClick = async (data, taskIndex, effortIndex) => {
    setItemDetails({ ...itemDetails, details: tasks[taskIndex], index: taskIndex, editDetails: data })
    setModalVisibility(true)
  }
  const onEffortUpdate = (totalTaskDuration) => {
    // const is_selected = tasks[selectedTask.index].is_selected
    // tasks[selectedTask.index].is_selected = is_selected
    tasks[selectedTask.index]['total_working_duration'] = totalTaskDuration
    setTasks([...tasks])

  }
  const onCustomPeriodChange = (date, type) => {
    if (type === "from") {
      setCustomPeriod({ ...customPeriod, fromDate: date })
    } else {
      setCustomPeriod({ ...customPeriod, toDate: date })
    }
  }


  return (
    <React.Fragment>
      <div className="bg-screenBackgroundColor flex flex-col justify-between overflow-auto w-full p-1 overflow-hidden">
        {modalVisibility && <EffortsPopup setState={setModalVisibility} data={itemDetails} onSuccessCreate={onSuccessCreate} />}
        <div className='flex w-full space-x-0 space-y-2 flex-col md:flex-row md:space-x-3 md:space-y-0 mb-3 '>
          <div className='md:w-64'>
            <Dropdown options={projects} optionLabel="project_name" value={selectedProject ? selectedProject : { project_name: 'All Projects' }} setValue={(value) => {
              selectProject(value)
            }} />
          </div>
          <div className='md:w-64'>
            <Dropdown options={timePeriods} optionLabel="title" value={selectedDuration ? selectedDuration : { title: 'Select Option' }} setValue={(value) => {
              selectDuration(value)

            }} />
          </div>
          {selectedDuration.title == "Custom" &&
            <CustomDateRengePicker fromDate={customPeriod.fromDate} toDate={customPeriod.toDate} setDate={onCustomPeriodChange} />
          }

          <div className='md:w-64'>
            <Dropdown options={employeeList} optionLabel="employee_name" value={selectedEmployee ? selectedEmployee : { name: 'All Employees' }} setValue={(value) => {
              selectEmployee(value)
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
          {/* <div className='w-1/2 '>
            <CustomDatePicker />
          </div> */}
        </div>
        <div className='overflow-auto' style={{ height: 'calc(100vh - 170px)', }}>
          {
            tasks.length > 0 ?
              <TasksTimeSheet isAllEmployeeFilter={selectedEmployee.employee_name == "All Employee"} fromAlerts={props && props.from == ALERTS} tasks={tasks} onEffortUpdate={onEffortUpdate} onAddEffortClick={onAddEffortClick} onItemClick={onItemClick} onDeleteEffort={onDeleteEffort} onEffortItemClick={onEffortItemClick}></TasksTimeSheet>
              :
              <div className='text-center items-center justify-center flex h-[70vh]'>
                No task found.
              </div>
          }

        </div>
        {netWorkCallStatus && <Loader></Loader>}
      </div>
    </React.Fragment>
  )
}


