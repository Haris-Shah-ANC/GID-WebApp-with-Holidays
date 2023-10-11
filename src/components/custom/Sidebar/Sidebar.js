import React, { Children, useContext, useEffect, useRef, useState } from 'react';
import ModelComponent from '../Model/ModelComponent';
import { routesName } from '../../../config/routesName';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
  add_task,
  imagesList,
  create_new_work_space,
  add_project,
  add_project_module,
  file_upload,
  add_meeting_link,
} from '../../../utils/Constant';
import AddProject from '../../pages/mainManagement/AddProject';
import { apiAction } from '../../../api/api';
import { getEffortAlertsStatus, getMeetingLinkUrl, get_workspace } from '../../../api/urls';
import { getWorkspaceInfo, setWorkspaceInfo } from '../../../config/cookiesInfo';
import * as Actions from '../../../state/Actions'
import { sidebarMenu } from '../../../config/routes';
import ButtonWithImage from '../Elements/buttons/ButtonWithImage';
import SidebarHeader from './SidebarHeader';
import SidebarMenuItem from './SidebarMenuItem';
import WorkspaceList from './WorkspaceList';


const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, sideNavigationRef }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = Actions.getState(useContext)
  const dispatch = Actions.getDispatch(useContext)
  const workspace = getWorkspaceInfo()
  const [navigationUrl, setNavigationUrl] = useState([])

  const [activeItem, setActiveItem] = useState(routesName.dashboard.activeRoute);

  React.useEffect(() => {
    let pathname = Object.values(routesName).find((item) => item.path === location.pathname);
    let currentRoute = Object.keys(routesName).find((routeKey) => {
      return pathname && routesName[routeKey].path === pathname.path
    })

    if (currentRoute) {
      setActiveItem(routesName[currentRoute].activeRoute)
    }
  }, [location.pathname])

  const [showModal, setShowModal] = React.useState(false);

  const navigateToPage = (item) => {
    if (item.name === "Create New Project") {
      setShowModal(add_project)
    } else if (item.name === "Create New Module") {
      setShowModal(add_project_module)
    } else {
      setActiveItem(item.active)
      navigate(item.path)
    }
  }


  useEffect(() => {
    if (workspace) {
      const menuOptions = sidebarMenu(workspace.role)
      const item = menuOptions.find((item, index) => { return item.name === activeItem })
      if (!item) {
        setActiveItem("Dashboard")
        navigate("/dashboard")
      }
      setNavigationUrl([...menuOptions])
    }
  }, [state.workspace])

  const getActiveRoute = () => {
    if (activeItem == "Calender") {
      return "calender_view"
    } else {
      return "dashboard"
    }
  }
  const isActive = (item) => {
    return item == activeItem
  }

  return (
    <div className='overflow-hidden hover:overflow-auto h-full'>
      <div className="flex flex-col h-full mx-2 bg-white " ref={sideNavigationRef} >
        <div className="flex items-center justify-between border-gray-400">
          <SidebarHeader isSidebarOpen={isSidebarOpen}></SidebarHeader>
        </div>
        <nav className=" h-full overflow-y-auto overflow-x-hidden">
          <ul className="flex flex-col ">
            <li
              title={isSidebarOpen ? '' : "Add Task"}
              className={` ${isSidebarOpen ? '' : 'justify-center'}  text-gray-500 text-sm  p-5 rounded-md font-quicksand font-bold  p-4 border-gray-400 flex items-center  cursor-pointer hover:bg-blue-400  hover:text-white`}
              onClick={() => {

                setShowModal(add_task)
              }}
            >
              <i className={`fa-solid fa-plus mr-2`}></i>
              <span className={`${isSidebarOpen ? '' : 'hidden'}`}>Add Task</span>
            </li>

            {navigationUrl.map((item, index) => {
              return (
                <React.Fragment key={index}>

                  {
                    item.hasOwnProperty('childItem') ? (

                      <ChildItemComponent item={item} isSidebarOpen={isSidebarOpen} activeItem={activeItem} setIsSidebarOpen={setIsSidebarOpen} setShowModal={setShowModal} showModal={showModal} navigate={navigate} />

                    ) : (
                      <SidebarMenuItem isSidebarOpen={isSidebarOpen} onClick={navigateToPage} activeItem={activeItem} menuItem={item} ></SidebarMenuItem>
                    )
                  }
                </React.Fragment>
              );
            })}
          </ul>
        </nav>

        <div className={`cursor-default border-dark-purple justify-center flex my-2`}>
          <ButtonWithImage className={'cursor-pointer w-8 h-8 rounded-full border-dark-purple justify-center flex p-0 m-0 group'} title={""} iconStyle={`mr-0`} disabled={false} onButtonClick={() => setIsSidebarOpen(!isSidebarOpen)}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 p-[6px] align-baseline  fill-blue-600 rounded-full bg-blue-300 shadow-xl ${isSidebarOpen ? "rotate-180" : "rotate-0"}`} height="1em" viewBox="0 0 320 512">
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" /></svg>}>
          </ButtonWithImage>
          {/* <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 p-[6px] align-baseline hidden md:block fill-blue-600 rounded-full bg-blue-300 shadow-xl ${isSidebarOpen ? "rotate-180" : "rotate-0"}`} height="1em" viewBox="0 0 320 512">
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg> */}
        </div>

      </div>
      <ModelComponent showModal={showModal} setShowModal={setShowModal} from={getActiveRoute()} />

    </div>


  )
}

export default Sidebar;

const ChildItemComponent = (props) => {
  const { item, activeItem, isSidebarOpen, setIsSidebarOpen, setShowModal, navigate, showModal } = props;
  const { childItem } = item;
  const [workspaces, setWorkSpaces] = useState([])
  const [meetingLinkList, setMeetingLinkList] = useState([])
  const { work_id } = getWorkspaceInfo()
  const dispatch = Actions.getDispatch(useContext);
  const [isVisible, setModalVisible] = useState(false)
  const [collapse, setCollapse] = React.useState(false);
  let workspace = getWorkspaceInfo(navigate)

  const onClickedHandler = () => {
    setCollapse(!collapse)
    // setIsSidebarOpen(true)
  }

  React.useEffect(() => {
    if (!isSidebarOpen) {
      setCollapse(false)
    }
  }, [isSidebarOpen])

  useEffect(() => {
    fetchWorkspaces()
    fetchMeetingLinks()

  }, [])

  const fetchWorkspaces = async () => {
    let response = await apiAction({ url: get_workspace(), method: "get", data: null })
    if (response)
      setWorkSpaces(response.result)

  }
  const fetchMeetingLinks = async () => {
    let response = await apiAction({ url: getMeetingLinkUrl(work_id), method: "get", data: null })
    if (response)
      setMeetingLinkList(response.result)


  }

  const onItemInteraction = (workspace) => {
    setCollapse(!collapse)
    setWorkspaceInfo(workspace);
    setWorkSpaces([...workspaces])
    dispatch(Actions.stateChange("workspace", workspace))
  }

  return (

    <React.Fragment>
      <ModelComponent showModal={isVisible} setShowModal={setModalVisible} onSuccess={() => fetchMeetingLinks()} />

      <li
        onClick={() => onClickedHandler()}
        title={isSidebarOpen ? '' : item.name}
        className={` ${isSidebarOpen ? '' : 'justify-center'} ${activeItem === item.active ? 'bg-blue-600 font-bold text-white' : ''} p-5 text-sm text-gray-500 font-quicksand font-semibold border-gray-400 flex items-center rounded-md hover:${activeItem === item.active ? 'bg-blue-500' : 'bg-blue-400'} hover:text-white`}
      >
        <span className="cursor-pointer">
          <i className={`${item.icon} mr-2`}></i>
          <span className={`${isSidebarOpen ? '' : 'hidden'}`}>{item.name}</span>
        </span>
        {isSidebarOpen &&
          <span className="ml-auto cursor-pointer"><i className={`fa-solid fa-angle-${collapse ? 'down' : 'right'}`}></i></span>
        }
      </li>
      {collapse &&
        <div className='px-4 py-2 '>
          <ul className='p-0 bg-white shadow-lg rounded-md flex flex-col text-black'>
            {childItem === 'work_space' &&
              <WorkspaceList workspaces={workspaces} setShowModal={setShowModal} work_id={work_id} onItemInteraction={onItemInteraction}></WorkspaceList>
            }

            {childItem === 'hrms' &&
              <React.Fragment>
                <li className='p-2 text-gray-500 font-quicksand font-semibold text-sm'>Select:</li>
                <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md font-quicksand font-semibold text-sm' onClick={() => { navigate(item.path) }}>
                  Reports
                </li>
                <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md font-quicksand font-semibold text-sm' onClick={() => { setShowModal(file_upload) }}>
                  <a class="collapse-item" target="_blank">Upload</a>
                </li>
              </React.Fragment>
            }

            {childItem === 'meeting' &&
              <React.Fragment>
                <li className='p-2 text-gray-500 font-quicksand font-semibold text-sm'>Select Meeting:</li>
                {meetingLinkList.map((item) => (
                  <li className='cursor-pointer hover:bg-gray-200 rounded-md font-quicksand font-semibold text-sm'>
                    <a class="collapse-item  flex p-2 mt-1" href={`${item.meeting_link}`} target="_blank">{item.meeting_title}</a>
                  </li>
                )
                )}

                <li className='p-2 text-sm cursor-pointer hover:bg-gray-200 rounded-md' onClick={() => { setModalVisible(add_meeting_link) }}><div className=" flex items-center"><i className="fa-solid fa-plus mr-1 font-semibold font-quicksand text-sm"></i>Add New Meeting</div></li>
              </React.Fragment>
            }
            {childItem === "analysis" &&
              <React.Fragment>
                <li className='p-2 text-gray-500 font-quicksand font-semibold text-sm'>Select</li>
                {
                  workspace.role == "Admin" &&
                  <>
                    <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md font-quicksand font-semibold text-sm' onClick={() => { navigate(routesName.analysis.path) }}>
                      Analysis
                    </li>
                    <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md font-quicksand font-semibold text-sm' onClick={() => { navigate(routesName.budget.path) }}>
                      Budget
                    </li>
                  </>
                }

                <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md font-quicksand font-semibold text-sm' onClick={() => { navigate(routesName.tasks.path) }}>
                  Tasks
                </li>
                <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md font-quicksand font-semibold text-sm' onClick={() => {
                  Actions.resetFileImports(dispatch)
                  navigate(routesName.uploadTimesheet.path)
                }}>
                  Upload Timesheet
                </li>


              </React.Fragment>
            }

          </ul>
        </div>
      }
    </React.Fragment>
  )
}
