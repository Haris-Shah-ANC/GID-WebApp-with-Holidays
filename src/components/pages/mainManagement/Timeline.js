import React from 'react';
import moment from 'moment';
import Card from '../../custom/Cards/Card';
import { apiAction } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import * as Actions from '../../../state/Actions';
import Dropdown from '../../custom/Dropdown/Dropdown';
import ModelComponent from '../../custom/Model/ModelComponent';
import { DateFormatCard, add_task } from '../../../utils/Constant';

import {
  employee,
  timeline_task,
  get_all_project,
} from '../../../api/urls';

import {
  getTimeAgo,
  expiredCheck,
} from '../../../utils/Utils';

import {
  getLoginDetails,
  getWorkspaceInfo,
} from '../../../config/cookiesInfo';

const Timeline = () => {
  const navigate = useNavigate();
  const dispatch = Actions.getDispatch(React.useContext);

  const { user_id } = getLoginDetails();
  const { work_id } = getWorkspaceInfo();
  const [filters, setFilters] = React.useState({
    employee_id: user_id,
  })

  const [timelineCompletedTask, setTimelineCompletedTask] = React.useState([]);
  const [timelinePendingTask, setTimelinePendingTask] = React.useState([]);

  const [employeeResults, setEmployeeResults] = React.useState([]);
  const getEmployeeResultsApi = async (id) => {
    let res = await apiAction({
      url: employee(id),
      method: 'get',
      navigate: navigate,
      dispatch: dispatch,
    })
    if (res.success) {
      setEmployeeResults([...res.results])
    }
  }
  const getTimelineTaskApi = async (w_id, u_id, status) => {
    let res = await apiAction({
      method: 'get',
      navigate: navigate,
      dispatch: dispatch,
      url: timeline_task(w_id, u_id, status),
    })
    if (res) {
      if (status === 'Completed') {
        setTimelineCompletedTask([...res.result])
      } else if (status === 'Pending')
        setTimelinePendingTask([...res.result])
    }
  }

  React.useEffect(() => {
    if (work_id) {
      getTimelineTaskApi(work_id, filters.employee_id, 'Completed');
      getTimelineTaskApi(work_id, filters.employee_id, 'Pending');
    }
  }, [work_id, filters.employee_id])

  React.useEffect(() => {
    if (work_id) {
      getEmployeeResultsApi(work_id);
    }
  }, [work_id])

  const [showModal, setShowModal] = React.useState(false);
  const [formData, setFormData] = React.useState({});

  let gridData = [{ title: 'Pending', icon: 'fa-hourglass-end', is_completed: false, data: timelinePendingTask }, { title: 'Completed', icon: 'fa-check', is_completed: true, data: timelineCompletedTask }]
  return (
    <React.Fragment>
      <ModelComponent showModal={showModal} setShowModal={setShowModal} data={formData} />
      <Filter
        filters={filters}
        setFilters={setFilters}
        employeeResults={employeeResults}
      />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
        {gridData.map((dataItem, index) => {
          return (
            <div key={index} className=''>
              <div className="bg-vimeo-regular h-10 text-center font-semibold px-4 py-2 text-white">
                <i className={`fa-solid ${dataItem.icon} mr-2`}></i>{dataItem.title}
              </div>
              <div className="overflow-y-auto"
                style={{ height: 'calc(100vh - 250px)' }}
              >
                {dataItem.data.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`p-2 ${!dataItem.is_completed ? 'cursor-pointer' : ''}`}
                      onClick={() => {
                        if (!dataItem.is_completed) {
                          setFormData({
                            task: item.task,
                            module_id: null,
                            work_id: work_id,
                            status: item.status, 
                            task_id: item.task_id,
                            project_id: item.project_id,
                            dead_line: moment(item.dead_line).format("YYYY-MM-DD HH:mm"),
                          });
                          setShowModal(add_task);
                        }
                      }}
                    >
                      <TimelineCard {...item} is_completed={dataItem.is_completed} />
                    </div>
                  );
                })}
              </div>
            </div>
          )
        })}
        {/* <div className="grid grid-cols-1">
          <div className="bg-vimeo-regular h-10 text-center font-semibold px-4 py-2 text-white">
            <i className="fa-solid fa-hourglass-end mr-2"></i>Pending
          </div>
          <div
            className="overflow-y-auto"
            style={{ height: 'calc(100vh - 250px)' }}
          >
            {timelinePendingTask.map((item, index) => {
              return (
                <div
                  className="p-2 cursor-pointer"
                  key={index}
                  onClick={() => {
                    setFormData({
                      task: item.task,
                      module_id: null,
                      work_id: work_id,
                      status: item.status,
                      task_id: item.task_id,
                      project_id: item.project_id,
                      dead_line: moment(item.dead_line).format("YYYY-MM-DD HH:mm"),
                    });
                    setShowModal(add_task);
                  }}
                >
                  <TimelineCard {...item} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1">
          <div className="bg-vimeo-regular h-10 text-center font-semibold px-4 py-2 text-white">
            <i className="fa-solid fa-check mr-2"></i>Completed
          </div>
          <div
            className="overflow-y-auto max-w-full"
            style={{ height: 'calc(100vh - 250px)' }}
          >
            {timelineCompletedTask.map((item, index) => {
              return (
                <div className="p-2" key={index}>
                  <TimelineCard {...item} is_completed={true} />
                </div>
              );
            })}
          </div>
        </div> */}
      </div>


    </React.Fragment>
  )
}

export default Timeline

const Filter = (props) => {
  const { employeeResults, filters, setFilters } = props;
  let selectedUser = employeeResults.find((item) => item.id === filters.employee_id);

  return (
    <nav className="bg-white p-4 mb-4 flex flex-col sm:flex-row items-center gap-4">
      <div className='w-auto'>
        <i className="fa-solid fa-user text-gray-500 text-lg mr-2"></i>
        <span className="text-lg font-bold">{selectedUser ? selectedUser.employee_name : ''}</span>
      </div>
      <div className='w-72'>
        <Dropdown options={employeeResults} optionLabel={'employee_name'} value={selectedUser ? selectedUser : null} setValue={(value) => setFilters((previous) => ({ ...previous, employee_id: value ? value.id : null }))} />
      </div>
    </nav>
  )
}

const TimelineCard = (props) => {
  const { user_id } = getLoginDetails();
  const { is_completed, assignee, dead_line, employee_name, project_name, employee_id, task, created_at } = props;

  let my_task = user_id === employee_id;

  const maxLength = 50;
  const truncatedTask = task.length > maxLength ? task.slice(0, maxLength) + "....." : task;
  return (
    <React.Fragment>
      <Card className={`h-full ${my_task ? 'border-left-success' : 'border-left-blue'}`}>
        <div className='p-3'>
          <div className="flex flex-wrap relative">
            <div className="w-full md:w-1/2 flex items-center mb-2 md:mb-0">
              <i className="fa-solid fa-user text-gray-500 text-lg mr-2"></i>
              <span className="text-lg font-bold">{employee_name}</span>
            </div>
            <div className="w-full md:w-1/2 text-right">
              <span className="text-gray-500 ml-auto mt-1 text-sm">{getTimeAgo(created_at)}</span>
            </div>
          </div>

          <div className="mt-3 mb-4 text-blueGray-500 leading-relaxed">{task}</div>

          <div className="mt-auto flex flex-wrap">
            <div className=''>
              <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-lightBlue-600 bg-lightBlue-200 last:mr-0 mr-1">
               {project_name}</span>
            </div>
            <div className='ml-auto'>
              <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-blueGray-600 bg-blueGray-200 last:mr-0 mr-1">
                Assigned By:<i className="fa-solid fa-user mr-1 ml-1"></i>{assignee === employee_name ? "Self" : assignee}
              </span>
            </div>

            <div className='ml-auto'>
              <span className={`text-xs font-semibold inline-block py-1 px-2 rounded-full ${is_completed ? 'text-blueGray-500' : expiredCheck(dead_line) ? 'text-red-400' : 'text-green-400'} last:mr-0 mr-1`}>
              <i className="fa-solid fa-clock mr-1"></i> {moment(dead_line).format(DateFormatCard)}
              </span>
            </div>

          </div>
        </div>
      </Card>
    </React.Fragment>
  );
};
