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


const data = () => {
    return (
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t text-black">
                <h3 className="text-2xl font-semibold">Modal Title</h3>
                <button
                    className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                    onClick={() => setShowModal(false)}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>


            {/*body*/}
            <div className="relative p-6 flex-auto">
                <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    I always felt like I could do anything. That’s the main thing people are controlled by! Thoughts- their perception of themselves! They're slowed down by their perception of themselves. If you're taught you can’t do anything, you won’t do anything. I was taught I could do everything.
                </p>
            </div>

            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                >
                    Close
                </button>
                <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                >
                    Save Changes
                </button>
            </div>
        </div>
    )
}