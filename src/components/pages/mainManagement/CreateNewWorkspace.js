import React from 'react';
import Input from '../../custom/Elements/Input';

const CreateNewWorkspace = (props) => {
    const { setShowModal } = props

    const [workspaceName, setWorkspaceName] = React.useState('');
    const [clockIn, setClockIn] = React.useState('');
    const [clockOut, setClockOut] = React.useState('');

    const handleWorkspaceNameChange = (e) => {
        setWorkspaceName(e.target.value);
    };

    const handleClockInChange = (e) => {
        setClockIn(e.target.value);
    };

    const handleClockOutChange = (e) => {
        setClockOut(e.target.value);
    };

    const handleSaveChanges = () => {
        // Do something with the captured input values
        console.log('Workspace Name:', workspaceName);
        console.log('Clock In:', clockIn);
        console.log('Clock Out:', clockOut);

        // Reset the input values
        setWorkspaceName('');
        setClockIn('');
        setClockOut('');
    };

    return (
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/* header */}
            <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t text-black">
                <h3 className="text-2xl font-semibold">Create New Workspace</h3>
                <button
                    className="text-lg w-10 h-10 ml-auto rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center"
                    onClick={() => setShowModal(false)}
                >
                    <i className="fa-solid fa-times"></i>
                </button>
            </div>

            {/* body */}
            <div className="relative p-6 flex-auto">
                <div className="my-1">
                    <label className="text-slate-500 text-base" htmlFor="workspaceName">Workspace Name</label>
                    <Input
                        type="text"
                        id="workspaceName"
                        name="workspaceName"
                        placeholder="Enter workspace name"
                        value={workspaceName}
                        onChange={handleWorkspaceNameChange}
                    />
                </div>
                <div className="my-4">
                    <label className="text-slate-500 text-base flex items-center" htmlFor="clock-in">
                        <i className="fa-regular fa-clock text-base mr-1"></i>
                        Clock In
                    </label>
                    <Input
                        type="time"
                        id="clock-in"
                        name="clock-in"
                        value={clockIn}
                        onChange={handleClockInChange}
                    />
                </div>
                <div className="my-4">
                    <label className="text-slate-500 text-base flex items-center" htmlFor="clock-out">
                        <i className="fa-regular fa-clock text-base mr-1"></i>
                        Clock Out
                    </label>
                    <Input
                        type="time"
                        id="clock-out"
                        name="clock-out"
                        value={clockOut}
                        onChange={handleClockOutChange}
                    />
                </div>
            </div>

            {/* footer */}
            <div className="p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                    className="bg-blue-500 text-white active:bg-blue-600 font-bold text-sm w-full py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleSaveChanges}
                >
                    Save Changes
                </button>
            </div>



        </div>
    );
};

export default CreateNewWorkspace;