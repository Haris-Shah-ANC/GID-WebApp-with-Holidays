import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { twMerge } from "tailwind-merge";
import { formatDate } from "../../../utils/Utils";
import { DateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { func } from 'prop-types';

export default function CustomDateTimePicker(props) {
    const { id = "", dataTestId = "", value, validation, disabledCloseIcon, disabledDatePicker, placeholder, className, maxDate, minDate, onDateChange } = props
    const tailwindMergedCSS = twMerge(`rounded-md border border-blueGray-300 text-sm font-quicksand font-medium text-blueGray-700 placeholder-blueGray-200`, className)

    const handleValueChange = (value) => {
        onDateChange(value)
    }

    return (

        <div className={tailwindMergedCSS} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                    slotProps={{ textField: { size: 'small', error: false, placeholder: 'DD-MM-YYYY', className: `bg-white rounded-lg focus:outline-none ${className}` } }}
                    value={dayjs(value)}
                    format="DD-MM-YYYY hh:mm A"
                    maxDate={maxDate && dayjs(maxDate)}
                    minDate={minDate && dayjs(minDate)}
                    onAccept={(e) => {
                        handleValueChange(e)
                    }}
                />
            </LocalizationProvider>
        </div>
    )
}

// export function OnlyDatePicker({ selected, onChange }) {

//     const handleDateChange = (date) => {
//         onChange(date);
//     };

//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DatePicker
//                 value={selected} 
//                 format="DD-MM-YYYY"
//                 onChange={handleDateChange} 
//                 slotProps={{ textField: { size: 'small', error: false, placeholder: 'MM-DD-YYYY', className: `bg-white rounded-lg focus:outline-none` } }}
//             />
//         </LocalizationProvider>
//     );
// }