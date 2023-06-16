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
    <div className={`bg-blue-500 text-white block  top-0 bottom-0 w-${isSidebarOpen ? '64' : 'auto'} shadow-xl left-0 fixed flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0 ${sidebarShow}`}>
      <ModelComponent showModal={showModal} setShowModal={setShowModal} />

      <div className="flex-grow">
        <div className="flex items-center justify-between border-b border-gray-400">
          <div className='flex items-center'>
            <img
              src={imagesList.appLogo.src}
              alt={imagesList.appLogo.alt}
              className="w-20 h-20 rounded-full mr-4"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold">GET IT</span>
              <span className="text-xl font-bold">DONE</span>
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
        <nav className="h-full overflow-y-auto overflow-x-hidden">
          <ul className="flex flex-col">
            <li
              title={isSidebarOpen ? '' : "Add Task"}
              className={` ${isSidebarOpen ? '' : 'justify-center'} bg-vimeo-regular font-semibold p-4 border-b border-gray-400 flex items-center hover:bg-vimeo-active cursor-pointer`}
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
                      className={` ${isSidebarOpen ? '' : 'justify-center'} ${activeItem === item.active ? 'bg-blue-700 font-semibold' : ''} p-4 border-b border-gray-400 flex items-center hover:bg-blue-600 cursor-pointer`}
                      onClick={() => { setActiveItem(item.active); navigate(item.path) }}
                    >
                      <Link
                        to={item.path}
                        className="text-white cursor-pointer"
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
        className={` ${isSidebarOpen ? '' : 'justify-center'} ${activeItem === item.active ? 'bg-blue-700 font-semibold' : ''} p-4 border-b border-gray-400 flex items-center hover:bg-blue-600`}
      >
        <span className="text-white cursor-pointer">
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
                <li className='p-2 text-gray-500'>Select Workspace:</li>
                <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md'>ANC</li>
                <li onClick={() => { setShowModal(create_new_work_space) }} className='p-2 text-sm cursor-pointer hover:bg-gray-200 rounded-md'><div className=" flex items-center"><i className="fa-solid fa-plus mr-1 font-semibold"></i>Create New Workspace</div></li>
              </React.Fragment>
            }

            {childItem === 'meeting' &&
              <React.Fragment>
                <li className='p-2 text-gray-500'>Select Meeting:</li>
                <li className='p-2 cursor-pointer hover:bg-gray-200 rounded-md'>Daily Standup</li>
                <li className='p-2 text-sm cursor-pointer hover:bg-gray-200 rounded-md'><div className=" flex items-center"><i className="fa-solid fa-plus mr-1 font-semibold"></i>Add New Meeting</div></li>
              </React.Fragment>
            }
          </ul>
        </div>
      }
    </React.Fragment>
  )
}
