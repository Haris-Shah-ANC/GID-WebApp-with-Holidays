import { useContext, useEffect, useState } from "react"
import CustomLabel from "../../../custom/Elements/CustomLabel"
import GidInput from "../../../custom/Elements/inputs/GidInput"
import CustomDatePicker from "../../../custom/Elements/CustomDatePicker"
import { formatDate, isFormValid, notifyErrorMessage, notifySuccessMessage } from "../../../../utils/Utils"
import PlainButton from "../../../custom/Elements/buttons/PlainButton"
import { apiAction } from "../../../../api/api"
import { getAddHolidaysUrl, getUpdateHolidaysUrl } from "../../../../api/urls"
import { getWorkspaceInfo } from "../../../../config/cookiesInfo"
import { useNavigate } from "react-router-dom"
import * as Actions from '../../../../state/Actions';

export default function AddHolidayForm(props) {
    const { onClose, onSuccess, isFormVisible, data,index } = props
    const { work_id } = getWorkspaceInfo();
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(useContext);
    const [formData, setFormData] = useState({ "workspace_id": work_id, "holiday_dates": [{ event_name: data ? data.event_name : "", date: data ? data.holiday_date : "" }] })

    useEffect(() => {
        if (itIsEditAction) {
            formData.holiday_dates[0].event_name = data.event_name
            formData.holiday_dates[0].date = data.holiday_date
            formData.holiday_dates[0]["holiday_id"] = data.holiday_id
            setFormData({ ...formData })
        }
    }, [data])
    const itIsEditAction = Boolean(data)
    const addHoliday = async () => {
        let res = await apiAction({
            url: itIsEditAction ? getUpdateHolidaysUrl() : getAddHolidaysUrl(),
            method: 'post',
            navigate: navigate,
            dispatch: dispatch,
            data: formData
        })
        if (res) {
            if (res.success) {
                notifySuccessMessage(res.status)
                onSuccess(res.result, itIsEditAction,index)
                onClose()

            } else {
                notifyErrorMessage(res.status)
            }
        }
    }
    const onAddHolidayClick = () => {
        let validation_data = [
            { key: "event_name", message: 'Please enter the holiday title!' },
            { key: "date", message: `Please select the date!` },
        ]

        const { isValid, message } = isFormValid(formData.holiday_dates[0], validation_data);
        if (isValid) {
            addHoliday()
        }
    }

    return (
        <div className="bg-white flex flex-col shadow  py-2 px-3 rounded-md mt-5 ">
            <p className='text-xl  pt-2'>Holiday Details</p>
            <div className="flex-row flex gap-5 items-center">
                <div className="my-4 flex flex-col w-1/4">
                    <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Title"} />
                    <GidInput
                        inputType={"text"}
                        disable={false}
                        className={""}
                        placeholderMsg={"Enter holiday title"}
                        value={formData.holiday_dates[0] && formData.holiday_dates[0].event_name}
                        onBlurEvent={() => { }}
                        onTextChange={(e) => {
                            formData.holiday_dates[0].event_name = e.target.value
                            setFormData({ ...formData })
                        }}
                    >
                    </GidInput>
                </div>
                <div className="my-4 flex flex-col">
                    <CustomLabel className={`mb-1 font-quicksand font-semibold text-sm`} label={"Date"}
                    />
                    <CustomDatePicker
                        inputType={"date"}
                        id={`date`}
                        disable={false}
                        className={"w-25 flex"}
                        value={formData.holiday_dates[0] ? formatDate(formData.holiday_dates[0].date, "YYYY-MM-DD") : null}  // using this format because we want to send data to backend in this format
                        onBlurEvent={() => { }}
                        maxDate={null}
                        onDateChange={(date) => {
                            formData.holiday_dates[0].date = date
                            setFormData({ ...formData })
                        }} />
                </div>
                <div className="ml-16 flex gap-10 mt-5">
                    <PlainButton title={itIsEditAction ? "Update" : "Save"} onButtonClick={onAddHolidayClick} className={""} disable={false} />

                    <PlainButton title={"Cancel"} onButtonClick={onClose} className={"bg-white text-blue-500 border-[1px] hover:bg-blue-100 border-blue-500"} disable={false} />
                </div>
            </div>
        </div>
    )
}