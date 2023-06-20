import React from 'react';
import ModelComponent from '../Model/ModelComponent';
import { routesName } from '../../../config/routesName';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
  add_task,
  imagesList,
  create_new_work_space,
} from '../../../utils/Constant';

const Sidebar = ({ navigationUrl = [], isSidebarOpen, setIsSidebarOpen, sidebarShow, setSidebarShow, handleDrawerClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeItem, setActiveItem] = React.useState(routesName.dashboard.activeRoute);

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
  return (
    <div className={`bg-white text-white block  top-0 bottom-0 w-${isSidebarOpen ? '64' : 'auto'} shadow-xl left-0 fixed flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0 ${sidebarShow}`}>
      <ModelComponent showModal={showModal} setShowModal={setShowModal} />

      <div className="flex-grow">
        <div className="flex items-center justify-between border-gray-400">
          <div className='flex items-center  w-full'>
            <img
              src={imagesList.appLogo.src}
              alt={imagesList.appLogo.alt}
              className="w-20 my-4 rounded-full mr-4 bg-cover"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold font-quicksand text-blue-500">GET IT</span>
              <span className="text-xl font-bold font-quicksand text-blue-500">DONE</span>
            </div>
          </div>
          <button
            className="p-2 text-white md:hidden outline-none focus:outline-none"
            onClick={handleDrawerClick}
          >
            <span className='border-gray-400 px-4 py-2 rounded-full'>
              <i className="fa-solid fa-xmark text-3xl"></i>
            </span>
          </button>
        </div>
        <nav className=" overflow-y-auto overflow-x-hidden">
          <ul className="flex flex-col">
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
                    <ChildItemComponent item={item} isSidebarOpen={isSidebarOpen} activeItem={activeItem} setIsSidebarOpen={setIsSidebarOpen} setShowModal={setShowModal} />
                  ) : (
                    <li
                      title={isSidebarOpen ? '' : item.name}
                      className={` ${isSidebarOpen ? '' : 'justify-center'} ${activeItem === item.active ? 'bg-blue-600 font-bold text-white' : ''} m-1 text-gray-500 text-sm font-quicksand font-semibold px-4 py-5 border-gray-400 flex items-center rounded-md ${activeItem === item.active ? 'hover:bg-blue-600': 'hover:bg-blue-400'} cursor-pointer hover:text-white`}
                      onClick={() => { setActiveItem(item.active); navigate(item.path) }}
                    >
                      <Link
                        to={item.path}
                        className="cursor-pointer"
                        onClick={() => navigate(item.path)}
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
      </div>
    </div>


  )
}

export default Sidebar;

const ChildItemComponent = (props) => {
  const { item, activeItem, isSidebarOpen, setIsSidebarOpen, setShowModal } = props;
  const { childItem } = item;

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
  // const [showModal, setShowModal] = React.useState(false);

  return (

    <React.Fragment>
      <li
        onClick={() => onClickedHandler()}
        title={isSidebarOpen ? '' : item.name}
        className={` ${isSidebarOpen ? '' : 'justify-center'} ${activeItem === item.active ? 'bg-blue-600 font-bold text-white' : ''} m-1 text-sm text-gray-500 font-quicksand font-semibold p-4 border-gray-400 flex items-center rounded-md hover:${activeItem === item.active ? 'bg-blue-500': 'bg-blue-400'} hover:text-white`}
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
          <ul className='p-2 bg-white shadow-lg rounded-md flex flex-col text-black'>
            {childItem === 'work_space' &&
              <React.Fragment>
                <li className='p-2 text-gray-500 font-quicksand font-semibold text-sm'>Select Workspace:</li>
                <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md font-semibold text-sm'>ANC</li>
                <li onClick={() => { setShowModal(create_new_work_space) }} className='p-2 text-sm cursor-pointer hover:bg-gray-200 rounded-md font-medium'><div className=" flex items-center"><i className="fa-solid fa-plus mr-1 font-semibold"></i>Create New Workspace</div></li>
              </React.Fragment>
            }

            {childItem === 'meeting' &&
              <React.Fragment>
                <li className='p-2 text-gray-500 font-quicksand font-semibold text-sm'>Select Meeting:</li>
                <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md font-quicksand font-semibold text-sm'>Daily Standup</li>
                <li className='p-2 text-sm cursor-pointer hover:bg-gray-200 rounded-md'><div className=" flex items-center"><i className="fa-solid fa-plus mr-1 font-semibold font-quicksand text-sm"></i>Add New Meeting</div></li>
              </React.Fragment>
            }
          </ul>
        </div>
      }
    </React.Fragment>
  )
}
