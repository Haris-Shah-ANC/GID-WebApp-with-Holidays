import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SidebarMenuItem(props) {
    const {isSidebarOpen, activeItem, menuItem, onClick} = props
    const navigate = useNavigate()
  return (
      <li
      title={isSidebarOpen ? '' : menuItem.name}
      className={` ${isSidebarOpen ? '' : 'justify-center'} ${activeItem === menuItem.active ? 'bg-blue-600 font-bold text-white' : ''} m-1 text-gray-500 text-sm font-quicksand font-semibold px-4 py-5 border-gray-400 flex items-center rounded-md ${activeItem === menuItem.active ? 'hover:bg-blue-600': 'hover:bg-blue-400'} cursor-pointer hover:text-white`}
      onClick={() => { 
        onClick(menuItem)
      }}
    >
      {/* <Link
        className="cursor-pointer"
        onClick={() => {
          console.log("MENU ITEM CLICK", "ON LINK CLICK")
          if((menuItem.name != "Create New Project") && (menuItem.name != "Create New Module")){
            navigate(menuItem.path)
          }
        }}
      > */}
        <i className={`${menuItem.icon} mr-2`}></i>
        <span className={`${isSidebarOpen ? '' : 'hidden'}`}>{menuItem.name}</span>
      {/* </Link> */}
    </li>
  )
}
