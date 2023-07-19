import React, { useState } from 'react'
import Sidebar from './Sidebar'

export default function SidebarContainer(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
    <div className={`bg-white text-white hidden md:block top-0 bottom-0 ${isSidebarOpen ? 'w-72' : 'w-20'} shadow-xl flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0`}>
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={(value)=>handleClick(value)} ></Sidebar>
        {/* <ModelComponent showModal={showModal} setShowModal={setShowModal} /> */}
    </div>
  )
}
