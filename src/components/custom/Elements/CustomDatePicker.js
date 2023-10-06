
import { forwardRef, useState } from "react";

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { IconButton } from "@mui/material";
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';


export default function CustomDatePicker(props) {
    const { id = "", dataTestId = "", validation, disabledCloseIcon, disabledDatePicker, placeholder, } = props
    const [value, setValue] = useState(null)

    const handleValueChange = (value) => {
        setValue(value)
    }


    return (

        <div className="absolute">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    slotProps={{ textField: { size: 'small', className: 'bg-white rounded-lg focus:outline-none ' } }}
                    // slots={{ field: SignIn }}
                    
                    format="DD-MM-YYYY"
                    className="cursor-pointer" 
                    
                    />

            </LocalizationProvider>
           
        </div>




    )
}