import React from 'react';
import CreateNewTask from '../../pages/mainManagement/CreateNewTask';
import CreateNewWorkspace from '../../pages/mainManagement/CreateNewWorkspace';

import {
    add_project,
    add_project_module,
    add_task,
    create_new_work_space,
    filter_and_sort,
} from '../../../utils/Constant';
import FilterAndSort from '../../pages/mainManagement/FilterAndSort';
import AddProject from '../../pages/mainManagement/AddProject';
import AddModule from '../../pages/mainManagement/AddModule';

const ModelComponent = (props) => {
    const { showModal, setShowModal, data ,onFilterApply,onFilterClear} = props
    return (
        showModal ? (
            <>
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                    {/* <div className="relative my-6"> */}
                    {showModal === create_new_work_space &&
                        <CreateNewWorkspace setShowModal={setShowModal} data={data} />
                    }
                    {showModal === add_task &&
                        <CreateNewTask setShowModal={setShowModal} data={data} />
                    }
                    {showModal === filter_and_sort &&
                        <FilterAndSort setShowModal={setShowModal} data={data} onFilterApply={onFilterApply} onFilterClear={onFilterClear}/>
                    }
                    { showModal === add_project && 
                        <AddProject setShowModal={setShowModal} data={data}></AddProject>
                    }
                    { showModal === add_project_module && 
                        <AddModule setShowModal={setShowModal} data={data}></AddModule>
                    }
                </div>
                {/* </div> */}
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
        ) : null
    );
}

export default ModelComponent;
