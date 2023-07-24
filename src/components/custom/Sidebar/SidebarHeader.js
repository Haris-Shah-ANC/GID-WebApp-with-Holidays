import React from 'react'
import { imagesList } from '../../../utils/Constant'

export default function SidebarHeader(props) {
    const {isSidebarOpen} = props
  return (
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
  )
}
