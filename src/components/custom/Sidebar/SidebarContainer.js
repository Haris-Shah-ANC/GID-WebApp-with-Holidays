import React, { useState } from 'react'
import Sidebar from './Sidebar'

export default function SidebarContainer(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleClick=(value)=>{
    setIsSidebarOpen(value)
  }

  // const navigateToPage = (item) => {
  //   setActiveItem(item.active)
  //   if(item.name === "Create New Project"){
  //     setShowModal(add_project)
  //   }else if(item.name === "Create New Module") {
  //     setShowModal(add_project_module)
  //   }else{
  //     navigate(item.path)
  //   }
  // }

  return (
    // <div className={`bg-black text-white hidden md:block ${isSidebarOpen ? 'w-72' : 'w-20'} shadow-xl md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0`}>
        <div className={`bg-white text-white hidden md:block transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={(value)=>handleClick(value)} ></Sidebar>
        </div>
    // </div>
  )
}
