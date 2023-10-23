import React from "react";
import ModelComponent from "../../custom/Model/ModelComponent";
import { add_holidays } from "../../../utils/Constant";
import { formatDate } from "../../../utils/Utils";
const Holidays = () => {

    const [showModal, setShowModal] = React.useState(false);    
    
    const [holidays, setHolidays] = React.useState([
        { date: '2023-10-24', title: 'Dussehra' },
        { date: '2023-10-02', title: 'Gandhi Jayanti' },
        { date: '2023-03-05', title: 'Holi' },
        { date: '2023-11-23', title: 'Diwali' },
    ]);

    const [holidayToEdit, setHolidayToEdit] = React.useState(null);

    // function to add a new holiday
    const addNewHoliday = (newHoliday) => {
        if (holidayToEdit) {
            // If editing, update the holiday
            const updatedHolidays = holidays.map((holiday) =>
                holiday === holidayToEdit ? newHoliday : holiday
            );
            setHolidays(updatedHolidays);
            setHolidayToEdit(null); // Clear the edit mode
        } else {
            // If adding, create a new holiday
            setHolidays([...holidays, newHoliday]);
        }
        setShowModal(false);
    };

    // Funtion to edit a holiday
    const editHoliday = (holiday) => {
        setHolidayToEdit(holiday);
        setShowModal(add_holidays); // Open the modal
    };

    // Function to delete a holiday
    const deleteHoliday = (e, index) => {
        const updatedHolidays = holidays.filter((data, i) => i !== index);
        e.stopPropagation();
        setHolidays(updatedHolidays);
    };

    return (

        <div>
            <ModelComponent
                showModal={showModal}
                setShowModal={setShowModal}
                onSuccess={addNewHoliday}
                holidayToEdit={holidayToEdit}
            />

            <button
                onClick={() => { setShowModal(add_holidays); }}
                className='hover:bg-blue-600 bg-blue-500 hover:shadow-lg  text-sm font-quicksand font-bold py-2.5 px-5 text-white duration-150 rounded shadow mb-5 text-right'>
                Add Holiday
            </button>

            <table className='w-full bg-white'>
                <thead className='bg-gray-200 px-10 h-10 text-left'>
                    <tr>
                        <th className="pl-3">
                            Date
                        </th>
                        <th className="pl-3">
                            Title
                        </th>
                        <th>
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {holidays.map((holiday, index) => (
                        <tr key={index} className='bg-white'>
                            {/* Changing format from "YYYY-MM-DD" to "DD-MM-YYYY" here to display */}
                            <td className='text-md p-3 text-left'>{formatDate(holiday.date,"DD-MM-YYYY")}</td> 
                            <td className='text-md text-left p-3'>{holiday.title}</td>
                            <td>
                                <button
                                    onClick={(e) => { editHoliday(holiday); }}
                                    className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-1 px-3 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => deleteHoliday(e, index)}
                                    className="bg-red-400 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Holidays;
