import React from 'react';
import CreateNewTask from '../../pages/mainManagement/CreateNewTask';
import CreateNewWorkspace from '../../pages/mainManagement/CreateNewWorkspace';

import {
    add_effort,
    add_folder,
    add_holiday,
    add_mapping,
    add_meeting_link,
    add_note,
    add_project,
    add_project_module,
    add_task,
    add_time_sheet,
    create_new_work_space,
    delete_modal,
    delete_notification,
    file_upload,
    filter_and_sort,
    import_confirmation,
    manage_action,
    share_note,
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
import AddMappingModal from './AddMappingModal';
import UploadConfirmationDialog from '../../pages/mainManagement/UploadConfirmationDialog';
import AddFolderModal from '../../pages/mainManagement/notes/AddFolderModal';
import AddNewNoteModal from '../../pages/mainManagement/notes/AddNewNoteModal';
import CommonDeletePupUp from './CommonDeletePupUp';
import ShareNotesModal from '../../pages/mainManagement/holiday/ShareNotesModal';

const ModelComponent = (props) => {
    const { showModal, setShowModal, data, onFilterApply, onFilterClear, from, onSuccess = () => "", onSuccessDelete = () => "" } = props
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
                        <FileUpload setShowModal={setShowModal} data={data} onSuccess={(val) => onSuccess(val)} from={from}></FileUpload>
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
                        showModal === add_mapping &&
                        <AddMappingModal setShowModal={setShowModal} data={data} onSuccess={onSuccess} from={from} />
                    }
                    {
                        showModal === import_confirmation &&
                        <UploadConfirmationDialog setShowModal={setShowModal} data={data} onSuccess={(val) => onSuccess(val)} from={from} />
                    }
                    {
                        showModal === add_folder &&
                        <AddFolderModal setShowModal={setShowModal} data={data} onSuccess={(val) => onSuccess(val)} from={from} />
                    }
                    {
                        showModal === add_note &&
                        <AddNewNoteModal setShowModal={setShowModal} data={data} onSuccess={(val) => onSuccess(val)} from={from} />
                    }
                    {showModal == delete_modal &&
                        <CommonDeletePupUp onSuccess={(id, type) => onSuccessDelete(id, type)} data={data} setShowModal={setShowModal} />}
                    {
                        showModal === share_note || showModal === manage_action ?
                            <ShareNotesModal setShowModal={setShowModal} onSuccess={onSuccess} data={data} />
                            : null
                    }
                </Box>
            </Modal>
            // <>
            //     <div className="justify-center items-center flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            //         {showModal === create_new_work_space &&
            //             <CreateNewWorkspace setShowModal={setShowModal} data={data} />

            //         }
            //         {showModal === add_task &&
            //             <CreateNewTask setShowModal={setShowModal} data={data} from={from} />
            //         }
            //         {showModal === add_project_module &&
            //             <AddModule setShowModal={setShowModal} data={data} onFilterApply={onFilterApply} onFilterClear={onFilterClear} />
            //         }
            //         {showModal === filter_and_sort &&
            //             <FilterAndSort setShowModal={setShowModal} data={data} onFilterApply={onFilterApply} onFilterClear={onFilterClear} />
            //         }
            //         {showModal === add_project &&
            //             <AddProject setShowModal={setShowModal} data={data}></AddProject>
            //         }
            //         {showModal === add_meeting_link &&
            //             <AddMeetingLinkModal setShowModal={setShowModal} data={data} onSuccess={() => onSuccess()}></AddMeetingLinkModal>
            //         }
            //         {
            //             showModal === file_upload &&
            //             <FileUpload setShowModal={setShowModal} data={data} onSuccess={(val) => onSuccess(val)}></FileUpload>
            //         }
            //         {
            //             showModal === add_time_sheet &&
            //             <AddTimeSheetModal setShowModal={setShowModal} data={data}></AddTimeSheetModal>
            //         }
            //         {
            //             showModal === delete_notification &&
            //             <DeleteNotificationModal setShowModal={setShowModal} data={data}></DeleteNotificationModal>
            //         }

            //         {
            //             showModal === add_effort &&
            //             <EffortsComponent setShowModal={setShowModal} data={data}></EffortsComponent>
            //         }
            //     </div>
            //     {/* </div> */}
            //     <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            // </>
        ) : null
    );
}

export default ModelComponent;
