import React, { useContext, useRef, useState } from 'react'
import { MAPPING, UPLOAD_FILE, file_upload, svgIcons } from '../../../../utils/Constant';
import { apiAction, apiActionFormData } from '../../../../api/api';
import ButtonWithImage from './ButtonWithImage';
import { getTheTimeSheetUploadUrl } from '../../../../api/urls';
import { getWorkspaceInfo } from '../../../../config/cookiesInfo';
import { notifyInfoMessage, notifySuccessMessage } from '../../../../utils/Utils';
import ModelComponent from '../../Model/ModelComponent';
import * as Actions from '../../../../state/Actions';
import { twMerge } from 'tailwind-merge';

export default function FileUploadButton(props) {
  const { onSuccessFileUpload, from = "timesheet", className, children } = props
  const state = Actions.getState(useContext);
  const dispatch = Actions.getDispatch(useContext);

  const { mappings, mapping_for } = state
  const { rows, fileName, columns } = mappings
  const [file, setFile] = useState(null)
  const inputFile = useRef(null);
  const { work_id } = getWorkspaceInfo();
  const [isVisible, setVisible] = useState(false)
  const tailwindMergedCSS = twMerge(`flex flex-col md:flex-row w-full justify-center items-center gap-1 ${file ? "text-black" : "text-gray-500"}`, className)
  console.log("PROPS", props)
  return (


    <div className={tailwindMergedCSS}>
      <>
        <ModelComponent showModal={isVisible} setShowModal={setVisible} data={{ from: from }} onSuccess={(data) => {
          setFile(data)
          onSuccessFileUpload(data)
        }} />
      </>
      <ButtonWithImage onButtonClick={() => {
        // inputFile.current.click()
        setVisible(file_upload)
      }} title={UPLOAD_FILE} className={"py-2"} icon={svgIcons("mr-2 self-center fill-white", "upload")}></ButtonWithImage>
      {/* <input type="file" onChange={onFileEvent} onClick={(event) => event.target.value = null} ref={inputFile} style={{ display: 'none' }} /> */}
      {from == MAPPING ?
        <>
          <p className={`justify-center text-center align-middle text-black font-quicksand font-semibold pl-3`}>{children ? children:""}</p>
          { }
        </>
        : <>
          <p className={`justify-center text-center align-middle`}>{svgIcons(`ml-2 mr-1 self-center fill-black`, "attachment")} </p>
          {file ? file.name : ""}
        </>
      }
    </div>
  )
}

