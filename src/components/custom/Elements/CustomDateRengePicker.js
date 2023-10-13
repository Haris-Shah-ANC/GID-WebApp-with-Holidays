import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { formatDate } from '../../../utils/Utils';
import moment from 'moment';

export default function CustomDateRengePicker(props) {
    const { fromDate, toDate, setDate } = props

    const onTextChange = (fromDate, toDate) => {
        setDate(fromDate, toDate)
    }

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* <DemoContainer components={['SingleInputDateRangeField']}> */}
                <DateRangePicker slotProps={{ textField: { size: 'small',error:false,placeholder:"DD-MM-YYYY  -  DD-MM-YYYY", className: 'bg-white rounded-lg focus:outline-none w-full' } }}
                    // slots={{ field: SignIn }}
                    onChange={(e) => {
                        if (e[0] && e[1]) {
                            onTextChange(formatDate(e[0]['$d'], "YYYY-MM-DD"), formatDate(e[1]['$d'], "YYYY-MM-DD"))
                        }
                    }}
                    format="DD-MM-YYYY"
                    
                    disableFuture
                    slots={{ field: SingleInputDateRangeField }} />
                {/* </DemoContainer> */}
            </LocalizationProvider>
        </div>
    );
    // const { fromDate, toDate, setDate } = props

    // const onTextChange = (event, type) => {
    //     setDate(event.target.value, type)
    // }
    // const onBlurEvent = (e) => {

    // }
    // return (
    //     <div className='border-2 flex flex-row items-center rounded bg-white'>
    //         <input
    //             type={"date"}
    //             name={"date"}
    //             id={"fromDate"}
    //             value={fromDate}
    //             className={`text-gray-600 font-quicksand font-medium outline-none shadow-none border-0 focus:border-0 active:border-0 focus:border-0 focus:outline-none text-blueGray-700 rounded-md font-quicksand font-medium text-sm`}
    //             onChange={(e) => { onTextChange(e, "from") }}
    //             onBlur={() => { onBlurEvent() }}
    //             placeholder={''}
    //             style={{ border: 0, boxShadow: 'none' }}
    //             max={toDate}
    //         >
    //         </input>
    //         <svg
    //             fill="currentColor"
    //             viewBox="0 0 16 16"
    //             height="1em"
    //             width="1em"
    //             className='mx-4'
    //         >
    //             <path
    //                 fillRule="evenodd"
    //                 d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z"
    //             />
    //         </svg>
    //         <input
    //             type={"date"}
    //             name={"date"}
    //             id={"toDate"}
    //             value={toDate}
    //             className={`text-gray-600 font-quicksand font-medium outline-none border-0 active:outline-none focus:border-0 focus:outline-none text-blueGray-700 rounded-md font-quicksand font-medium text-sm`}
    //             onChange={(e) => { onTextChange(e, "to") }}
    //             onBlur={() => { onBlurEvent() }}
    //             placeholder={''}
    //             min={fromDate}

    //             style={{ border: 0, boxShadow: 'none' }}
    //         >
    //         </input>

    //     </div>
    // )
}