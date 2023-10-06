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
    filter_and_sort,
} from '../../../utils/Constant';
import FilterAndSort from '../../pages/mainManagement/FilterAndSort';
import AddProject from '../../pages/mainManagement/AddProject';
import AddModule from '../../pages/mainManagement/AddModule';
import FileUpload from '../../pages/mainManagement/FileUpload';
import DeleteNotificationModal from '../../pages/mainManagement/DeleteNotificationModal';
import AddMeetingLinkModal from '../../pages/mainManagement/AddMeetingLinkModal';
import AddTimeSheetModal from './AddTimeSheetModal';
import EffortsComponent from '../EffortsComponent';

const ModelComponent = (props) => {
    const { showModal, setShowModal, data, onFilterApply, onFilterClear, from, onSuccess = () => "" } = props
    return (
        showModal ? (
            <>
                <div className="justify-center items-center flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    {/* <div className="relative my-6"> */}
                    {showModal === create_new_work_space &&
                        <CreateNewWorkspace setShowModal={setShowModal} data={data} />

                    }
                    {showModal === add_task &&
                        <CreateNewTask setShowModal={setShowModal} data={data} from={from} />
                    }
                    {showModal === add_project_module &&
                        <AddModule setShowModal={setShowModal} data={data} onFilterApply={onFilterApply} onFilterClear={onFilterClear} />
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
                    {
                        showModal === file_upload &&
                        <FileUpload setShowModal={setShowModal} data={data} onSuccess={(val) => onSuccess(val)}></FileUpload>
                    }
                    {
                        showModal === add_time_sheet &&
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
                </div>
                {/* </div> */}
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
        ) : null
    );
}

export default ModelComponent;
