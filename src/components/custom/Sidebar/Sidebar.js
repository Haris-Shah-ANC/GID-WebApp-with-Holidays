import React, { useContext, useEffect, useState } from 'react';
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
} from '../../../utils/Constant';
import AddProject from '../../pages/mainManagement/AddProject';
import { apiAction } from '../../../api/api';
import { get_workspace } from '../../../api/urls';
import { getWorkspaceInfo, setWorkspaceInfo } from '../../../config/cookiesInfo';
import * as Actions from '../../../state/Actions'


const Sidebar = ({ navigationUrl = [], isSidebarOpen, setIsSidebarOpen, sidebarShow, setSidebarShow, handleDrawerClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = Actions.getState(useContext)
  const {work_id} = state
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
    setActiveItem(item.active)
    if(item.name === "Create New Project"){
      console.log("IF "+item.name)
      setShowModal(add_project)
    }else if(item.name === "Create New Module") {
      console.log("ELSE IF "+item.name)
      setShowModal(add_project_module)
    }else{
      console.log("ELSE "+item.name)
      navigate(item.path)
    }
  }

  // duration-300 bottom-2 w-8 h-8 ${isSidebarOpen ? "ml-20" : "m-2"}
  return (
    <>
    {/* <div className='flex'> */}
      {/* <div className={`${isSidebarOpen ? "w-72": "w-20"} relative h-screen p-3  pt-8 bg-white duration-300 overflow-y-auto shadow-lg flex-nowrap`}>
          { isSidebarOpen && <div className="flex items-center h-8 mt-1">
              <img
                src={imagesList.appLogo.src}
                alt=''
                className={`cursor-pointer duration-500 w-12 h-8`}
              />
              <h1 className={`origin-left font-medium text-xl duration-300 w-full`}>Get It Done</h1>
            </div>
          }

          { isSidebarOpen && <div className={`absolute cursor-pointer top-9 right-2 w-8 h-8 border-dark-purple border-full rounded-full justify-center`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" className='w-full h-full p-[6px] align-baseline fill-blue-600'>
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </div>}

          { !isSidebarOpen &&
            <div className='flex justify-center cursor-pointer' onClick={() => {setIsSidebarOpen(!isSidebarOpen)}}>
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" className='self-center fill-slate-600'>
                <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
            </div>
          }
          <ul className='pt-6'>
            {
              navigationUrl.map((item, index) => {
                return (
                  <React.Fragment>
                    {
                      item.hasOwnProperty('childItem') ? 
                        <ChildItemComponent item={item} isSidebarOpen={isSidebarOpen} activeItem={activeItem} setIsSidebarOpen={setIsSidebarOpen} setShowModal={setShowModal} navigate={navigate}/>
                      : 
                      <li
                      key={index}
                      className={`flex rounded-md px-2 py-4 m-2 cursor-pointer hover:bg-blue-100 text-gray-500 text-sm items-center gap-x-4 ${activeItem === item.active ? 'bg-blue-600 font-bold text-white' : ''} "mt-2" ${
                        index === 0 && "bg-light-white"
                      } `}
                      onClick={() => { 
                        navigateToPage(item)
                      }}
                    >
                      <Link
                          className="cursor-pointer w-full justify-center flex"
                          onClick={() => {
                            console.log((item.name != "Create New Project") && (item.name != "Create New Module"))
                            if((item.name != "Create New Project") && (item.name != "Create New Module")){
                              navigate(item.path)
                            }
                          }}
                        >
                          <div className={`w-full ${isSidebarOpen ? "flex-col": "flex"} justify-center items-center`}>
                            <i className={`${item.icon} {}self-center`}></i>
                            {isSidebarOpen  && 
                            <span className={`${!isSidebarOpen && "scale-0"} origin-left duration-300 ml-2`}>
                            {item.name}
                          </span>}
                          </div>
                      </Link>
                      
                    </li>
                  }
                  </React.Fragment>
                )
              })
            }
          </ul>
      </div> */}
    {/* </div> */}


      <div className={`bg-white text-white block  top-0 bottom-0 ${isSidebarOpen ? 'w-64' : 'w-20'} shadow-xl left-0 fixed flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0 ${sidebarShow}`}>
      <div className="flex flex-col h-full mx-2 bg-white">
        <div className="flex items-center justify-between border-gray-400">
          <div className='flex items-center  w-full'>
            <img
              src={imagesList.appLogo.src}
              alt={imagesList.appLogo.alt}
              className="w-20 my-4 rounded-full mr-4 bg-cover"
            />
            { isSidebarOpen && <div className="flex flex-col">
              <span className="text-xl font-bold font-quicksand text-blue-500">GET IT</span>
              <span className="text-xl font-bold font-quicksand text-blue-500">DONE</span>
            </div>}
          </div>
          {/* <button
            className="p-2 text-white md:hidden outline-none focus:outline-none"
            onClick={handleDrawerClick}
          >
            <span className='border-gray-400 px-4 py-2 rounded-full'>
              <i className="fa-solid fa-xmark text-3xl"></i>
            </span>
          </button> */}
        </div>
        <nav className=" h-full overflow-y-auto overflow-x-hidden">
          <ul className="flex flex-col ">
            <li
              title={isSidebarOpen ? '' : "Add Task"}
              className={` ${isSidebarOpen ? '' : 'justify-center'} m-1 rounded-md font-quicksand font-bold bg-blue-500 p-4 border-gray-400 flex items-center hover:bg-vimeo-active cursor-pointer`}
              onClick={() => { setShowModal(add_task) }}
            >
              <i className={`fa-solid fa-plus mr-2`}></i>
              <span className={`${isSidebarOpen ? '' : 'hidden'}`}>Add Task</span>
            </li>

            {navigationUrl.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {item.hasOwnProperty('childItem') ? (
                    <ChildItemComponent item={item} isSidebarOpen={isSidebarOpen} activeItem={activeItem} setIsSidebarOpen={setIsSidebarOpen} setShowModal={setShowModal} navigate={navigate}/>
                  ) : (
                    <li
                      title={isSidebarOpen ? '' : item.name}
                      className={` ${isSidebarOpen ? '' : 'justify-center'} ${activeItem === item.active ? 'bg-blue-600 font-bold text-white' : ''} m-1 text-gray-500 text-sm font-quicksand font-semibold px-4 py-5 border-gray-400 flex items-center rounded-md ${activeItem === item.active ? 'hover:bg-blue-600': 'hover:bg-blue-400'} cursor-pointer hover:text-white`}
                      onClick={() => { 
                        setActiveItem(item.active)
                        if(item.name === "Create New Project"){
                          console.log("IF "+item.name)
                          setShowModal(add_project)
                        }else if(item.name === "Create New Module") {
                          console.log("ELSE IF "+item.name)
                          setShowModal(add_project_module)
                        }else{
                          console.log("ELSE "+item.name)
                          navigate(item.path)
                        }
                      }}
                    >
                      <Link
                        // to={((item.name != "Create New Project") && (item.name != "Create New Module")) ? item.path : null}
                        className="cursor-pointer"
                        onClick={() => {
                          console.log((item.name != "Create New Project") && (item.name != "Create New Module"))
                          if((item.name != "Create New Project") && (item.name != "Create New Module")){
                            navigate(item.path)
                          }
                        }}
                      >
                        <i className={`${item.icon} mr-2`}></i>
                        <span className={`${isSidebarOpen ? '' : 'hidden'}`}>{item.name}</span>
                      </Link>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </nav>
        
      <div className={`cursor-pointer border-dark-purple justify-center flex my-2`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
      <svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8 p-[6px] align-baseline fill-blue-600 rounded-full bg-blue-300 shadow-xl' height="1em" viewBox="0 0 320 512">
        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
          </div>
        </div>
        
    </div>
    <ModelComponent showModal={showModal} setShowModal={setShowModal} />

    </>


  )
}

export default Sidebar;

const ChildItemComponent = (props) => {
  const { item, activeItem, isSidebarOpen, setIsSidebarOpen, setShowModal, navigate } = props;
  const { childItem } = item;
  const [workspaces, setWorkSpaces] = useState([])
  const {work_id} = getWorkspaceInfo()
  const dispatch = Actions.getDispatch(useContext);

  const [collapse, setCollapse] = React.useState(false);
  const onClickedHandler = () => {
    setCollapse(!collapse)
    setIsSidebarOpen(true)
  }

  React.useEffect(() => {
    if (!isSidebarOpen) {
      setCollapse(false)
    }
  }, [isSidebarOpen])

  useEffect(() => {
    fetchWorkspaces()
  },[])

  const fetchWorkspaces = async() => {
    let response = await apiAction({url: get_workspace(), method: "get", data: null})
    setWorkSpaces(response.result)
    
  }
  // const [showModal, setShowModal] = React.useState(false);

  const onItemInteraction = (workspace) => {
    setWorkspaceInfo(workspace);
    setWorkSpaces([...workspaces])
    dispatch(Actions.stateChange("workspace", workspace))
  }

  return (

    <React.Fragment>
      <li
        onClick={() => onClickedHandler()}
        title={isSidebarOpen ? '' : item.name}
        className={` ${isSidebarOpen ? '' : 'justify-center'} ${activeItem === item.active ? 'bg-blue-600 font-bold text-white' : ''} p-5 text-sm text-gray-500 font-quicksand font-semibold border-gray-400 flex items-center rounded-md hover:${activeItem === item.active ? 'bg-blue-500': 'bg-blue-400'} hover:text-white`}
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
              <React.Fragment>
                <li className='p-2 text-gray-500 font-quicksand font-semibold text-sm'>Select Workspace:</li>
                {workspaces.map((item, index) => {
                  return <li className={`p-2 cursor-pointer ${work_id === item.work_id ? "bg-gray-200" : "bg-white"} hover:bg-gray-100 rounded-md font-semibold text-sm`} onClick={() => {onItemInteraction(item)}}>{item.workspace_name}</li>
                })}
                <li onClick={() => { setShowModal(create_new_work_space) }} className='p-2 text-sm cursor-pointer hover:bg-gray-200 rounded-md font-medium'><div className=" flex items-center"><i className="fa-solid fa-plus mr-1 font-semibold"></i>Create New Workspace</div></li>
              </React.Fragment>
            }

            

            {childItem === 'hrms' &&
              <React.Fragment>
                <li className='p-2 text-gray-500 font-quicksand font-semibold text-sm'>Select:</li>
                <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md font-quicksand font-semibold text-sm' onClick={() => {navigate(item.path)}}>
                  Reports
                </li>
                <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md font-quicksand font-semibold text-sm' onClick={() => {setShowModal(file_upload)}}>
                  <a class="collapse-item" target="_blank">Upload</a>
                </li>
                {/* <li className='p-2 text-sm cursor-pointer hover:bg-gray-200 rounded-md'><div className=" flex items-center"><i className="fa-solid fa-plus mr-1 font-semibold font-quicksand text-sm"></i>Add New Meeting</div></li> */}
              </React.Fragment>
            }

            {childItem === 'meeting' &&
              <React.Fragment>
                <li className='p-2 text-gray-500 font-quicksand font-semibold text-sm'>Select Meeting:</li>
                <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md font-quicksand font-semibold text-sm'>
                  <a class="collapse-item" href="https://meet.google.com/zbx-mkky-gux" target="_blank">Daily Standup</a>
                </li>
                <li className='p-2 text-sm cursor-pointer hover:bg-gray-200 rounded-md'><div className=" flex items-center"><i className="fa-solid fa-plus mr-1 font-semibold font-quicksand text-sm"></i>Add New Meeting</div></li>
              </React.Fragment>
            }

          </ul>
        </div>
      }
    </React.Fragment>
  )
}
