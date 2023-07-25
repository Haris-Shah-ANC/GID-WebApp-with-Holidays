import React, { useState } from 'react'
import { apiActionFormData } from '../../../api/api'
import { getWorkspaceInfo } from '../../../config/cookiesInfo'
import { isFormValid, notifyErrorMessage, notifySuccessMessage } from '../../../utils/Utils'
import { getTheAttendanceReportUploadUrl } from '../../../api/urls'
import PlainButton from '../../custom/Elements/buttons/PlainButton'

export default function FileUpload(props) {
  const { setShowModal } = props
  const {work_id} = getWorkspaceInfo()
  const [file, setFile] = useState(null)
  const [fileUploadData, setFileData] = useState({work_id: work_id, fileupload: null, year: ""})

  const uploadFile = async() => {
        let validation_data = [
            { key: "work_id", message: 'Workspace field left empty!' },
            { key: "year", message: "Year field left empty!" }
        ]
        if(file) {
          const { isValid, message } = isFormValid(fileUploadData, validation_data);
          if(isValid){
            let response = await apiActionFormData({url: getTheAttendanceReportUploadUrl(), method: "post", data: {work_id: work_id, fileupload: file, year: fileUploadData.year}})
            if(response.success){
              setShowModal(false)
              notifySuccessMessage(response.result)
            }else{
              notifyErrorMessage(response.result)
            }
          }else{
            notifyErrorMessage(message)
          }
          
        }else{
          notifyErrorMessage("File field left empty!")
        }
        

    // if(response.success){

    // }
}

const onFileEvent = (event) => {
    if(event.target.files && event.target.files.length){
        let file = event.target.files[0]
        const extension = file.name.split('.').pop();
        const fileSize = parseFloat(file.size / 1048576).toFixed(2) 
        if(fileSize > 5){
          alert("Max allowed size is 25MB. Current File size is " + fileSize +"MB")
        }else{
          setFile(file)
          setFileData({...fileUploadData, fileupload: {...fileUploadData.fileupload, file: file}})
          // uploadFile()
          // onFileUpload(event.target.files[0],{file:file, size: fileSize + "MB",extension:extension.toUpperCase(),name: file.name.replace(("." + extension), "")})
        }
        
    }
  }

  return (
    <div
    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 max-w-sm w-full">
            <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Upload File'}</h3>
                    <button
                        className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                        onClick={() => setShowModal(false)}
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                <div className='px-3 py-5 w-full flex flex-col'>
                  <input 
                    accept=".xls,"  
                    id="input-file" 
                    type="file"  
                    className='border w-full p-1 rounded-md'
                    onChange={(e)=>onFileEvent(e)} 
                    onClick={(e)=> { 
                        e.target.value = null
                    }}
                    />

                    <label className='mt-3 text-gray-600 font-quicksand font-semibold'>Year</label>
                    <input 
                    type="number"  
                    className='border w-full p-1 rounded-md'
                    value={fileUploadData.year}
                    onChange={(e)=> {setFileData({...fileUploadData, year: e.target.value})}} 
                    />

                    <PlainButton title={"Upload"} className={"mt-10"} onButtonClick={uploadFile} disable={false}></PlainButton>
                </div>
            </div>
        </div>
    </div>
  )
}
