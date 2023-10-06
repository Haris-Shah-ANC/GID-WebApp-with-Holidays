import React, { useState } from 'react'
import { apiActionFormData } from '../../../api/api'
import { getWorkspaceInfo } from '../../../config/cookiesInfo'
import { isFormValid, notifyErrorMessage, notifyInfoMessage, notifySuccessMessage } from '../../../utils/Utils'
import { getTheAttendanceReportUploadUrl, getTheTimeSheetUploadUrl } from '../../../api/urls'
import PlainButton from '../../custom/Elements/buttons/PlainButton'
import GidInput from '../../custom/Elements/inputs/GidInput'

export default function FileUpload(props) {
  const { setShowModal, data = {}, onSuccess = () => { } } = props
  const { work_id } = getWorkspaceInfo()
  const [file, setFile] = useState(null)
  const [fileUploadData, setFileData] = useState({ work_id: work_id, fileupload: null, year: "" })

  const uploadFile = async () => {
    let validation_data = [
      { key: "work_id", message: 'Workspace field left empty!' },
      { key: "year", message: "Year field left empty!" }
    ]
    if (file) {
      const { isValid, message } = isFormValid(fileUploadData, validation_data);
      if (isValid) {
        let response = await apiActionFormData({ url: getTheAttendanceReportUploadUrl(), method: "post", data: { work_id: work_id, fileupload: file, year: fileUploadData.year } })
        if (response.success) {
          setShowModal(false)
          notifySuccessMessage(response.result)
        } else {
          notifyErrorMessage(response.result)
        }
      } else {
        notifyErrorMessage(message)
      }

    } else {
      notifyErrorMessage("File field left empty!")
    }
  }
  const uploadTimeSheet = async () => {
    let response = await apiActionFormData({ url: getTheTimeSheetUploadUrl(), method: 'post', data: { "file": file, workspace_id: work_id } }, onError)
    if (response) {
      if (response.success) {
        onSuccess(file)
        setShowModal(false)
        notifySuccessMessage(response.status)
      } else {
        notifyInfoMessage(response.status)
      }
    }
    function onError(err) {
      console.log("UPLOAD ERROR", err)
    }
  }
  const onBtnClick = () => {
    if (data && data.from == "timesheet") {
      uploadTimeSheet()
    } else {
      uploadFile()
    }
  }
  const onFileEvent = (event) => {
    if (event.target.files && event.target.files.length) {
      let file = event.target.files[0]
      const extension = file.name.split('.').pop();
      const fileSize = parseFloat(file.size / 1048576).toFixed(2)
      if (fileSize > 5) {
        alert("Max allowed size is 25MB. Current File size is " + fileSize + "MB")
      } else {
        setFile(file)
        setFileData({ ...fileUploadData, fileupload: { ...fileUploadData.fileupload, file: file } })
        // uploadFile()
        // onFileUpload(event.target.files[0],{file:file, size: fileSize + "MB",extension:extension.toUpperCase(),name: file.name.replace(("." + extension), "")})
      }

    }
  }

  return (
    <div
      className="justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative my-6 max-w-sm">
        <div className="w-full border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
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
            <div className='flex-row flex items-center'>
              <input
                accept=".csv,.xls,.xlsx"
                id="input-file"
                type="file"
                className='border w-full p-1 rounded-md cursor-pointer'
                onChange={(e) => onFileEvent(e)}
                onClick={(e) => {
                  e.target.value = null
                }}
              />
              {/* <h3 className='ml-28 mr-10 text-black font-quicksand font-semibold absolute truncate w-full flex'>{fileUploadData.fileupload && fileUploadData.fileupload.file ? fileUploadData.fileupload.file.name : null}</h3> */}


            </div>

            {data ? data.from != "timesheet" &&
              <>
                <label className='mt-3 text-gray-600 font-quicksand font-semibold'>Year</label>
                <GidInput
                  inputType={"number"}
                  id={"year"}
                  disable={false}
                  className={""}
                  value={fileUploadData.year}
                  onBlurEvent={() => { }}
                  placeholderMsg="e.g 2023"
                  onTextChange={(event) => {
                    let value = event.target.value
                    if (String(value).length <= 1) {
                      let year = new Date().getFullYear()
                      setFileData({ ...fileUploadData, year: year })
                    } else {
                      setFileData({ ...fileUploadData, year: value })
                    }
                  }}
                >
                </GidInput>
              </>
              : null}

            <PlainButton title={"Upload"} className={"mt-10"} onButtonClick={onBtnClick} disable={false}></PlainButton>
          </div>
        </div>
      </div>
    </div>
  )
}
