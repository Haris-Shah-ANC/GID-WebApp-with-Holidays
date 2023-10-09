import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { formatDate } from '../../../utils/Utils';
import moment from 'moment';
import { MobileTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export default function CustomTimePicker(props) {
    const {onTimeChange } = props



    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker slotProps={{ textField: { size: 'small', className: 'bg-white rounded-lg focus:outline-none w-full' } }}
                    onChange={(e) => {
                        if (e)
                            onTimeChange(moment(e['$d']).format("HH:mm"))
                    }}
                    format="hh:mm a"
                />
            </LocalizationProvider>
        </div>
    );

}