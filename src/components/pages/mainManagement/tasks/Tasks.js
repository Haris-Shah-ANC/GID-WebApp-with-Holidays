import React, { useEffect, useState } from 'react'
import { apiAction } from '../../../../api/api'
import { useLocation, useNavigate } from 'react-router-dom';
import * as Actions from '../../../../state/Actions';
import { ALERTS, DATE, DURATION, END_TIME, MODULE, PROJECT, START_TIME, TASK, add_effort, svgIcons } from '../../../../utils/Constant';
import PlainButton from '../../../custom/Elements/buttons/PlainButton';
import { employee, getDeleteTaskEffortsUrl, getExportTimesheetUrl, getTasksUrl, getTheAddTaskEffortsUrl, getTheUpdateTaskEffortsUrl, get_all_project, get_task } from '../../../../api/urls';
import { getAccessToken, getLoginDetails, getWorkspaceInfo } from '../../../../config/cookiesInfo';
import { formatDate, getPreviousWeek, getTimePeriods, getYesterday, notifyErrorMessage, notifySuccessMessage } from '../../../../utils/Utils';
import Dropdown from '../../../custom/Dropdown/Dropdown';
import IconInput from '../../../custom/Elements/inputs/IconInput';
import EffortsPopup from './EffortsPopup';
import TasksTimeSheet from './TasksTimeSheet';
import Loader from '../../../custom/Loaders/Loader'
import moment from 'moment';
import CustomDateRengePicker from '../../../custom/Elements/CustomDateRengePicker';
import CustomDatePicker from '../../../custom/Elements/CustomDatePicker';
import ButtonWithImage from '../../../custom/Elements/buttons/ButtonWithImage';

const timePeriods = getTimePeriods()
timePeriods.push(
  {
    title: "Yesterday",
    period: `(${formatDate(getYesterday(), "DD MMM YY")})`,
    dates: {
      from: getYesterday(),
      to: getYesterday()
    }
  },)
timePeriods.splice(2, 0, {
  title: "Previous Week",
  subTitle: "previous week",
  period: `(${formatDate(getPreviousWeek().from, "DD MMM YY")} - ${formatDate(getPreviousWeek().to, "DD MMM YY")})`,
  dates: {
    from: getPreviousWeek().from,
    to: getPreviousWeek().to
  }
})



export default function Tasks(props) {
  const navigate = useNavigate();
  let workspace = getWorkspaceInfo(navigate)
  const location = useLocation()
  const paramsData = location.state
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
    if (props && props.taskData) {
      setTasks(props.taskData)
    } else {
      getTaskList(selectedProject, selectedEmployee)
    }

  }, [selectedDuration, searchText, customPeriod])

  useEffect(() => {
    if (!(props && props.taskData)) {
      getProjects()
      getEmployees()
      // timePeriods.push()
    }


  }, [])
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11)
  });

  const handleValueChange = newValue => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };
  const getPostBody = () => {
    let pBody = {
      workspace_id: work_id,
      task_description: searchText,
    }
    if (selectedDuration.title == "Custom") {
      pBody['from_date'] = customPeriod.fromDate
      pBody['to_date'] = customPeriod.toDate
    } else {
      pBody['from_date'] = selectedDuration ? selectedDuration.dates.from : null
      pBody['to_date'] = selectedDuration ? selectedDuration.dates.to : null
    }

    return pBody
  }
  const getTaskList = async (project, employee) => {
    setNetworkCallStatus(true)
    let res = await apiAction({ url: getTasksUrl(), method: 'post', data: { employee_id: employee ? employee.id : null, project_id: project ? project.project_id : null, ...getPostBody() }, navigate: navigate, dispatch: dispatch })
      .then((response) => {
        if (response) {
          if (response.success) {
            setTasks(response.result)
          }
        }
      })
      .catch((error) => {
        console.log("ERROR", error)
      })
    setNetworkCallStatus(false)

  }

  const exportTimesheet = async () => {
    let options = {
      method: 'post',
      body: JSON.stringify({ employee_id: user_id, project_id: selectedProject ? selectedProject.project_id : null, ...getPostBody() }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAccessToken()}`
      }
    }
    try {
      fetch(getExportTimesheetUrl(), options)
        .then((response) => {
          const blob = response.blob()
            .then((blobValue) => {
              const postData = getPostBody()
              const a = document.createElement('a');
              const url = window.URL.createObjectURL(blobValue);
              // Set the anchor's attributes for the download
              a.href = url;
              a.download = `timesheet_record_${user_id}_${postData.from_date}_${postData.to_date}.csv`;
              // Append the anchor to the body
              document.body.appendChild(a);
              // Trigger a click to initiate the download
              a.click();
              // Remove the anchor from the body
              document.body.removeChild(a);
              // Release the object URL
              window.URL.revokeObjectURL(url);
            })
        })
    } catch (error) {
      console.log("EXPORT ERROR", error)
    }

  }

  const getProjects = async () => {
    let res = await apiAction({
      method: 'get',
      navigate: navigate,
      dispatch: dispatch,
      url: get_all_project(work_id),
    }).then((response) => {
      if (response)
        if (response.success) {
          var sorted = response.result.sort((a, b) => a.project_name.localeCompare(b.project_name, undefined, {}));
          setProjects([{ project_name: 'All Projects' }, ...sorted])
        }
    })
      .catch((error) => {
        console.log("ERROR", error)
      })

  }
  const getEmployees = async (project) => {
    let res = await apiAction({
      url: employee(work_id, project && project.project_id),
      method: 'get',
      navigate: navigate,
      dispatch: dispatch,
    })
      .then((response) => {
        if (response) {
          var sorted = response.results.sort((a, b) => a.employee_name.localeCompare(b.employee_name, undefined, {}));

          setEmployeeList([{ employee_name: "All Employee" }, ...sorted])
          let found = sorted.find(function (element) {
            if (selectedEmployee != null) {
              return element.id == selectedEmployee.id;
            }
          });
          if (!found) {
            selectEmployee(null)
            getTaskList(project, undefined)
          } else {
            getTaskList(project, found)
          }
        }
      })
      .catch((error) => {
        console.log("ERROR", error)
      })

  }

  const calculateDuration = () => {
    return tasks.reduce((total, currentValue) => total = total + parseFloat(currentValue.total_working_duration), 0)
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
    console.log("TOTAL DURATION", totalTaskDuration)
    tasks[selectedTask.index]['total_working_duration'] = totalTaskDuration
    setTasks([...tasks])
  }
  const onCustomPeriodChange = (fromDate, toDate) => {
    setCustomPeriod({ ...customPeriod, fromDate: fromDate, toDate: toDate })
  }
  const fromAlert = () => {
    return props && props.from == ALERTS
  }
  const onExportTimesheetClick = () => {
    exportTimesheet()
  }
  const isExportBtnEnabled = () => {
    return selectedEmployee && selectedEmployee.id === user_id
  }
  return (
    <React.Fragment>
      <div className="bg-screenBackgroundColor flex flex-col justify-between w-full p-1 overflow-hidden">
        {modalVisibility && <EffortsPopup setState={setModalVisibility} data={itemDetails} onSuccessCreate={onSuccessCreate} />}
        {!(props && props.from == ALERTS) ?
          <div className="grid gap-5 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 flex">
            <div className=''>
              <Dropdown options={projects} optionLabel="project_name" value={selectedProject ? selectedProject : { project_name: 'All Projects' }} setValue={(value) => {
                selectProject(value)
                getEmployees(value)
              }} />
            </div>
            <div className=''>
              <Dropdown options={timePeriods} optionDescLabel={"period"} optionLabel="title" value={selectedDuration ? selectedDuration : { title: 'Select Option' }} setValue={(value) => {
                selectDuration(value)
              }} />
            </div>

            {selectedDuration.title == "Custom" &&
              <CustomDateRengePicker fromDate={customPeriod.fromDate} toDate={customPeriod.toDate} setDate={onCustomPeriodChange} />
            }
            <div className=''>
              <Dropdown options={employeeList} optionLabel="employee_name" value={selectedEmployee ? selectedEmployee : { name: 'All Employees' }} setValue={(value) => {
                selectEmployee(value)
                getTaskList(selectedProject, value)
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
            <div className='flex'>
              <ButtonWithImage onButtonClick={() => {
                onExportTimesheetClick()
              }} disable={!isExportBtnEnabled()} title={"Export Timesheet"} className={"py-2"} icon={svgIcons("mr-2 self-center fill-white", "export")}></ButtonWithImage>
            </div>

            {/* <div className=' py-2 flex-row bg-green-50 justify-center rounded-md'>
              <span className={`text-medium p-3 text-blueGray-500 font-interVar font-semibold w-full font-quicksand`}>Total Duration (hr) : </span>
              <span className={`text-medium p-3  font-interVar font-bold w-full font-quicksand`}>{parseFloat(calculateDuration()).toFixed(2)} hrs</span>
            </div> */}

          </div>
          : null}
        {
          tasks.length > 0 &&
          <div className='overflow-auto' style={{ height: 'calc(100vh - 170px)', ...props.style }}>
            <TasksTimeSheet period={selectedDuration} isAllEmployeeFilter={selectedEmployee ? selectedEmployee.employee_name == "All Employee" : true} fromAlerts={props && props.from == ALERTS} tasks={tasks} onEffortUpdate={onEffortUpdate} onAddEffortClick={onAddEffortClick} onItemClick={onItemClick} onDeleteEffort={onDeleteEffort} onEffortItemClick={onEffortItemClick}></TasksTimeSheet>
          </div>
        }

        {tasks.length <= 0 && <div className='text-center items-center justify-center flex h-[70vh]'>
          No task found.
        </div>
        }
        {netWorkCallStatus && <Loader></Loader>}
      </div>

    </React.Fragment>
  )
}


