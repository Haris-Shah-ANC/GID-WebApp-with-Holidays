import React, { useState } from 'react'
import PlainButton from '../../../custom/Elements/buttons/PlainButton'
import ButtonWithImage from '../../../custom/Elements/buttons/ButtonWithImage'
import GidInput from '../../../custom/Elements/inputs/GidInput'
import CustomLabel from '../../../custom/Elements/CustomLabel'
import CustomDatePicker from '../../../custom/Elements/CustomDatePicker'
import { formatDate } from '../../../../utils/Utils'

export default function AddHoliday(props) {

    const { setShowModal, onSuccess, holidayToEdit } = props

    //////////
    // Determine if we are adding a new holiday or editing an existing one
    const isEditing = !!holidayToEdit;

    // Initialize holidayData based on whether it's an edit or add operation
    const initialHolidayData = isEditing
        ? { ...holidayToEdit }      // Pre-fill with existing data for editing
        : { title: '', date: '' }; // Empty for adding
    /////////

    const [holidayData, setHolidayData] = useState(initialHolidayData)
    console.log("holidayData(date)==>", holidayData)

    const handleSubmit = () => {
        if (isEditing) {
            // If we're editing, pass back the edited data
            onSuccess(holidayData);
        } else {
            // If we're adding, create a new holiday
            onSuccess({ ...holidayData });
        }
        setShowModal(false);
    };

    return (
        <div>
            <div>
                {/* header */}
                <div className="flex items-center justify-between px-5 pt-5 border-solid border-slate-200 rounded-t text-black">
                    <h3 className="text-lg font-quicksand font-bold text-center w-full">{'Add Holiday'}</h3>
                    <ButtonWithImage
                        onButtonClick={() => { setShowModal(false) }}
                        title={""}
                        className={"rounded-full w-10 h-10 p-0 m-0 justify-center items-center bg-white shadow-none hover:bg-gray-200 active:bg-gray-200"}
                        icon={<i className="fa-solid fa-times text text-black self-center" color='black'></i>}
                    ></ButtonWithImage>
                </div>
                <form>

                    <div className="relative px-5 pt-2 flex-auto">
                        <div className="my-4 flex flex-col">
                            <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Add Title"} />
                            <GidInput
                                inputType={"text"}
                                disable={false}
                                className={""}
                                placeholderMsg={"Enter Holiday Title"}
                                value={holidayData.title}
                                onBlurEvent={() => { }}
                                onTextChange={(e) => {
                                    // if (e.target.value !== "")
                                    setHolidayData({ ...holidayData, title: e.target.value })
                                }}
                            >
                            </GidInput>
                        </div>
                        <div className="my-4 flex flex-col">
                            <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Add Title"}
                            />
                            <CustomDatePicker
                                inputType={"date"}
                                id={`date`}
                                disable={false}
                                className={"w-25 flex"}
                                value={formatDate(holidayData.date,"YYYY-MM-DD")}  // using this format because we want to send data to backend in this format
                                onBlurEvent={() => { }}
                                maxDate={null}
                                onDateChange={(date) => {
                                    setHolidayData({ ...holidayData, date: date })
                                }} />
                        </div>

                    </div>


                    <div className="p-6 border-solid border-slate-200 rounded-b">
                        <PlainButton
                            title={"Submit"}
                            className={"w-full"}
                            onButtonClick={handleSubmit}
                            disable={false}>
                        </PlainButton>
                    </div>

                </form>
            </div>
        </div>

    )
}
