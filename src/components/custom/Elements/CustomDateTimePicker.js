
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { twMerge } from "tailwind-merge";
import { formatDate } from "../../../utils/Utils";
import { DateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';


export default function CustomDateTimePicker(props) {
    const { id = "", dataTestId = "", value, validation, disabledCloseIcon, disabledDatePicker, placeholder, className, maxDate, minDate, onDateChange } = props
    const tailwindMergedCSS = twMerge(`rounded-md border border-blueGray-300 text-sm font-quicksand font-medium text-blueGray-700 placeholder-blueGray-200`, className)

    const handleValueChange = (value) => {
        onDateChange(value)
    }
    console.log("VALUE",value)

    return (

        <div className={tailwindMergedCSS} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                    slotProps={{ textField: { size: 'small', className: `bg-white rounded-lg focus:outline-none ${className}` } }}
                    value={dayjs(value)}
                    format="DD-MM-YYYY hh:mm A"
                    maxDate={maxDate && dayjs(maxDate)}
                    minDate={minDate && dayjs(minDate)}
                    onAccept={(e) => {
                        console.log("EVENT", e, dayjs(e).format("DD-MM-YYYY HH:mm A",), "------------", dayjs(e).toJSON())
                        handleValueChange(e)

                    }}
                    
                />
            </LocalizationProvider>

        </div>





    )
}