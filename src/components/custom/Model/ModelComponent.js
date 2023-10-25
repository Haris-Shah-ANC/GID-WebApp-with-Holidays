import React from 'react';
import CreateNewTask from '../../pages/mainManagement/CreateNewTask';
import CreateNewWorkspace from '../../pages/mainManagement/CreateNewWorkspace';

import {
    add_effort,
    add_meeting_link,
    add_project,
    add_project_module,
    add_task,
    add_time_sheet,
    create_new_work_space,
    delete_notification,
    file_upload,
    add_holidays,
    filter_and_sort,
    delete_comment,
} from '../../../utils/Constant';
import FilterAndSort from '../../pages/mainManagement/FilterAndSort';
import AddProject from '../../pages/mainManagement/AddProject';
import AddModule from '../../pages/mainManagement/AddModule';
import FileUpload from '../../pages/mainManagement/FileUpload';
import DeleteNotificationModal from '../../pages/mainManagement/DeleteNotificationModal';
import AddMeetingLinkModal from '../../pages/mainManagement/AddMeetingLinkModal';
import AddTimeSheetModal from './AddTimeSheetModal';
import EffortsComponent from '../EffortsComponent';
import { Box, Modal } from '@mui/material';
import AddHoliday from '../../pages/mainManagement/AddHoliday';
import DeleteModal from './DeleteModal';

const ModelComponent = (props) => {
    
    const { showModal, setShowModal, data, onFilterApply, onFilterClear, from, onSuccess = () => "", holidayToEdit} = props
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 15,
        borderRadius: 1,
        overflow: 'auto'
    };

    return (
        showModal ? (
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} >
                    {/* <div style={{
                        padding: 8, backgroundColor: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, maxHeight: 'calc(100vh - 180px)',
                        overflow: 'auto',boxShadow:20,maxHeight: 'calc(100vh - 180px)',
                    }}> */}
                    {showModal === add_project_module &&
                        <AddModule setShowModal={setShowModal} data={data} onFilterApply={onFilterApply} onFilterClear={onFilterClear} />
                    }
                    {showModal === add_task &&
                        <CreateNewTask setShowModal={setShowModal} data={data} from={from} />
                    }
                    {showModal === create_new_work_space &&
                        <CreateNewWorkspace setShowModal={setShowModal} data={data} />
                    }
                    {showModal === filter_and_sort &&
                        <FilterAndSort setShowModal={setShowModal} data={data} onFilterApply={onFilterApply} onFilterClear={onFilterClear} />
                    }
                    {showModal === add_project &&
                        <AddProject setShowModal={setShowModal} data={data}></AddProject>
                    }
                    {showModal === add_meeting_link &&
                        <AddMeetingLinkModal setShowModal={setShowModal} data={data} onSuccess={() => onSuccess()}></AddMeetingLinkModal>
                    }
                    {showModal === file_upload &&
                        <FileUpload setShowModal={setShowModal} data={data} onSuccess={(val) => onSuccess(val)}></FileUpload>
                    }
                    {showModal === add_time_sheet &&
                        <AddTimeSheetModal setShowModal={setShowModal} data={data}></AddTimeSheetModal>
                    }
                    {
                        showModal === delete_notification &&
                        <DeleteNotificationModal setShowModal={setShowModal} data={data}></DeleteNotificationModal>
                    }
                    {
                        showModal === add_effort &&
                        <EffortsComponent setShowModal={setShowModal} data={data}></EffortsComponent>
                    }
                    {
                        showModal === add_holidays &&
                        <AddHoliday setShowModal={setShowModal} onSuccess={onSuccess} holidayToEdit={holidayToEdit}/>
                    }
                    {
                        showModal === delete_comment && 
                        <DeleteModal setShowModal={setShowModal} />
                    }

                </Box>
            </Modal>
        ) : null
    );
}

export default ModelComponent;
