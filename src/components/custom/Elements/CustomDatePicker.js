
import { forwardRef, useState } from "react";

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { twMerge } from "tailwind-merge";
import { formatDate } from "../../../utils/Utils";


export default function CustomDatePicker(props) {
    const { id = "", dataTestId = "", value, validation, disabledCloseIcon, disabledDatePicker, placeholder, className, maxDate, minDate, onDateChange } = props
    const tailwindMergedCSS = twMerge(`rounded-md border border-blueGray-300 text-sm font-quicksand font-medium text-blueGray-700 placeholder-blueGray-200`, className)
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'day');

    const handleValueChange = (value) => {

        onDateChange(formatDate(value, "YYYY-MM-DD"))
    }

    return (

        <div className={tailwindMergedCSS} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    slotProps={{
                        textField: {
                            size: 'small',error:false,placeholder:'DD-MM-YYYY', className: `bg-white rounded-lg focus:outline-none ${className}`,
                            sx: { "& input::placeholder": { color: '#2F2F2E', fontWeight: '400', lineHeight: '16px', fontSize: '12px', fontStyle: 'normal', fontFamily: 'Noto Sans', opacity: 0.50, } }
                        }
                    }}
                    // slots={{ field: SignIn }}
                    value={dayjs(value)}
                    format="DD-MM-YYYY"
                    maxDate={maxDate && dayjs(maxDate)}
                    minDate={minDate && dayjs(minDate)}
                    onChange={(e) => {
                        if (e['$d']) {
                            handleValueChange(e['$d'])
                        }
                    }
                    }



                />

            </LocalizationProvider>

        </div>





    )
}