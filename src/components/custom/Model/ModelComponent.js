import React from 'react';
import CreateNewTask from '../../pages/mainManagement/CreateNewTask';
import CreateNewWorkspace from '../../pages/mainManagement/CreateNewWorkspace';

import {
    add_task,
    create_new_work_space,
} from '../../../utils/Constant';

const ModelComponent = (props) => {
    const { showModal, setShowModal,data } = props
    return (
        showModal ? (
            <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        {/*content*/}
                        {showModal === create_new_work_space &&
                            <CreateNewWorkspace setShowModal={setShowModal} data={data}/>
                        }
                        {showModal === add_task &&
                            <CreateNewTask setShowModal={setShowModal} data={data}/>
                        }
                    </div>
                </div>



                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
        ) : null
    )
}

export default ModelComponent;
