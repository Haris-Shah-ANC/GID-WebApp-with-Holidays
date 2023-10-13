import React, { useRef, useState } from 'react'
import { UPLOAD_FILE, file_upload, svgIcons } from '../../../../utils/Constant';
import { apiAction, apiActionFormData } from '../../../../api/api';
import ButtonWithImage from './ButtonWithImage';
import { getTheTimeSheetUploadUrl } from '../../../../api/urls';
import { getWorkspaceInfo } from '../../../../config/cookiesInfo';
import { notifyInfoMessage, notifySuccessMessage } from '../../../../utils/Utils';
import ModelComponent from '../../Model/ModelComponent';

export default function FileUploadButton(props) {
  const { onSuccessFileUpload } = props
  const [file, setFile] = useState(null)
  const inputFile = useRef(null);
  const { work_id } = getWorkspaceInfo();
  const [isVisible, setVisible] = useState(false)

  const onFileEvent = (event) => {
    console.log("FILE SELECT", event.target.files[0].name)
    if (event.target.files && event.target.files.length) {
      let file = event.target.files[0]
      const extension = file.name.split('.').pop();
      const fileSize = parseFloat(file.size / 1048576).toFixed(2)
      if (fileSize > 5) {
        alert("Max allowed size is 25MB. Current File size is " + fileSize + "MB")
      } else {
        setFile(file)
        uploadTimeSheet(file)
      }

    }
  }

  const uploadTimeSheet = async (data) => {
    let response = await apiActionFormData({ url: getTheTimeSheetUploadUrl(), method: 'post', data: { "file": data, workspace_id: work_id } }, onError)
    if (response) {
      if (response.success) {
        onSuccessFileUpload(data)
        notifySuccessMessage(response.status)
      } else {
        notifyInfoMessage(response.status)
      }
    }
    function onError(err) {
      console.log("UPLOAD ERROR", err)
    }
  }


  return (


    <div className={`flex flex-col md:flex-row w-full justify-center items-center gap-1 ${file ? "text-black" : "text-gray-500"}`}>
      <>
        <ModelComponent showModal={isVisible} setShowModal={setVisible} data={{ from: "timesheet" }} onSuccess={(data) => {
           setFile(data) 
           onSuccessFileUpload()}} />
      </>
      <ButtonWithImage onButtonClick={() => {
        // inputFile.current.click()
        setVisible(file_upload)
      }} title={UPLOAD_FILE} className={"py-2"} icon={svgIcons("mr-2 self-center fill-white", "upload")}></ButtonWithImage>
      {/* <input type="file" onChange={onFileEvent} onClick={(event) => event.target.value = null} ref={inputFile} style={{ display: 'none' }} /> */}
      {file &&
        <>
          <p className={`justify-center text-center align-middle`}>{svgIcons(`ml-2 mr-1 self-center fill-black`, "attachment")} </p>
          {file.name}
        </>}
    </div>
  )
}

