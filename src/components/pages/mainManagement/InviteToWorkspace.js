import React, { useState } from 'react'
import Input from '../../custom/Elements/Input'
import Dropdown from '../../custom/Dropdown/Dropdown'
import { ROLES } from '../../../utils/Constant'
import { apiAction } from '../../../api/api'
import { notifyErrorMessage, notifySuccessMessage, isFormValid, validateEmail } from '../../../utils/Utils'
import { getThesentInvitationUrl } from '../../../api/urls'
import { getWorkspaceInfo } from '../../../config/cookiesInfo'



export default function InviteToWorkspace(props) {
  const [listOfTeamMembers, setTeamMembers] = useState([{email: "", role: "Employee", isSent: false, hasInvalidEmail: false}])
  // const [teamMemberInfo, setTeamMemberInfo] = useState({email: "", role: ""})
  const {work_id} = getWorkspaceInfo()

  const addTeamMember = (index) => {
    listOfTeamMembers.push({email: "", role: "Employee", isSent: false, hasInvalidEmail: false})
    setTeamMembers([...listOfTeamMembers])
  }

  const removeTeamMember = (index) => {
    if(listOfTeamMembers.length === 1){
      setTeamMembers([{email: "", role: "Employee", isSent: false, hasInvalidEmail: false}])
    }else{
      console.log(JSON.stringify(listOfTeamMembers[index], 0, 1))
      listOfTeamMembers.splice(index, 1)
      setTeamMembers([...listOfTeamMembers])
    }
  }

  const onEmailChange = (index, data) => {
    listOfTeamMembers[index].email = data
    listOfTeamMembers[index].hasInvalidEmail = false
    setTeamMembers([...listOfTeamMembers])
  }

  const onRoleSelect =(index, item) =>{
    listOfTeamMembers[index].role = JSON.parse(item.target.value).role
    setTeamMembers([...listOfTeamMembers])
  }

  const hasValidData = () => {
    const emptyItemIndex = listOfTeamMembers.findIndex(item => !validateEmail(item.email))    
    if(emptyItemIndex > -1){
      console.log("INSIDE")
      listOfTeamMembers[emptyItemIndex].hasInvalidEmail = true
      setTeamMembers([...listOfTeamMembers])
      return false
    }
    return true
  }

  

  const onSendClick = () => {
    
    if(hasValidData()){
      let validation_data = [
        { key: "workspace_id", message: 'Workspace field left empty!' },
        { key: "send_to", message: "Email field left empty!" }
      ]
      const { isValid, message } = isFormValid({workspace_id: work_id, send_to: listOfTeamMembers}, validation_data);
      if (isValid) {
        sendInvitation()
      } else {
        notifyErrorMessage(message)
      }
    }
    
  }

  const sendInvitation = async () => {
    // e.preventDefault();
        let res = await apiAction({
            method: 'post',
            // navigate: navigate,
            // dispatch: dispatch,
            url: getThesentInvitationUrl(),
            data: {workspace_id: work_id, send_to: listOfTeamMembers},
        })
        if (res.success) {
            notifySuccessMessage(res.status);
            // navigate(routesName.assignTask.path);
        } else {
            notifyErrorMessage(res.detail)
        }
};

  return (
    <React.Fragment>
        <div className='font-bold font-quicksand text-2xl md:text-3xl text-center'>Invite your team members</div>
        <div className='font-medium font-quicksand text-sm md:text-md text-center text-gray-500 my-4'>Get your project up and running faster by directly inviting your team members to your project.</div>
        
        <div className='flex flex-col w-full justify-center items-center'>
            <div className='w-full max-w-sm'>
              {listOfTeamMembers.map((item, index)=>{
                console.log(index,item)
                return <div className='flex flex-col'>
                  <div className='flex flex-row space-x-1 mt-3'>
                    <div className='w-full flex items-center'>
                      <Input className={`border focus:border-blue-600 focus:border-1 justify-start w-3/5`} 
                        type="text"
                        value={item.email}
                        onChange={(e) => {onEmailChange(index, e.target.value)}}
                        required
                      ></Input>
                      <select
                          disabled={false}
                          onChange={(event) => {onRoleSelect(index, event)}}
                          // value={JSON.stringify(item.role)}
                          className= {`${false?'bg-gray-100 ':''} cursor-pointer w-36 md:w-2/5 ml-3 border-blueGray-300 text-blueGray-700 rounded font-quicksand font-semibold text-sm`}
                        > 
                          {ROLES.map((item, index) => {
                            return (
                              <React.Fragment key={index}>
                                {
                                  true && index === 0 ?
                                    <option value={JSON.stringify(item.role)} className="placeholder-blueGray-200 cursor-pointer font-quicksand font-medium">
                                      {item["role"]}
                                    </option>
                                    :
                                    <option value={JSON.stringify(item.role)} className="text-gray-600 cursor-pointer font-quicksand font-medium">
                                      {item["role"]}
                                    </option>
                                }
                              </React.Fragment>
                            )
                          }
                          )}
                        </select>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className='self-center' height="1em" viewBox="0 0 448 512" fill='#d24b45' onClick={() => {removeTeamMember(index, item)}}><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
                  </div>
                  {
                    item.hasInvalidEmail && <span className='text-xs font-quicksand font-semibold text-red-600 mt-1'>
                    Enter valid email
                  </span>
                  }
                </div>
              })}
              <div className='flex flex-col justify-center items-center'>
                <div className='w-full flex border-dashed border-[2px] bg-white hover:bg-gray-100 py-2 px-4 mt-4 !outline-none font-quicksand font-semibold text-sm justify-center items-center' onClick={() => {addTeamMember()}}>
                  <svg xmlns="http://www.w3.org/2000/svg" className='mr-2' height="1em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                  <span>Add Member</span>
                </div>
                <div className='flex rounded-md bg-blue-600 border-gray-200 border text-white font-quicksand font-semibold text-sm py-2 px-4 mt-4 hover:bg-blue-700' onClick={() => {onSendClick()}}>
                  <svg xmlns="http://www.w3.org/2000/svg" className='self-center mr-2' height="1em" viewBox="0 0 512 512" fill="#FFFFFF"><path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>
                  <span>Send Invitation</span>
                </div>
              </div>
            </div>
        </div>
        
    </React.Fragment>
    
  )
}
