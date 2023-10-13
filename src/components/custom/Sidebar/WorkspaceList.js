import React from 'react'
import { create_new_work_space } from '../../../utils/Constant'

export default function WorkspaceList(props) {
    const {workspaces, setShowModal, work_id, onItemInteraction} = props
  return (
    <React.Fragment>
        <li className='p-2 text-gray-500 font-quicksand font-semibold text-sm'>Select Workspace:</li>
        {workspaces.map((item, index) => {
            return <li className={`p-2 cursor-pointer ${work_id === item.work_id ? "bg-gray-200" : "bg-white"} hover:bg-gray-100 py-2 m-1 rounded-md font-bold font-quicksand text-sm`} onClick={() => {onItemInteraction(item)}}>{item.workspace_name}</li>
        })}
        <li onClick={() => { setShowModal(create_new_work_space) }} className='p-2 text-sm cursor-pointer hover:bg-gray-200 rounded-md font-medium'><div className=" flex items-center"><i className="fa-solid fa-plus mr-1 font-semibold"></i>Create New Workspace</div></li>
    </React.Fragment>
  )
}
