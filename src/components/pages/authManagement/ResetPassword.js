import React, { useEffect, useState } from 'react'
import CustomLabel from '../../custom/Elements/CustomLabel'
import { CHOOSE_A_NEW_PASSWORD, CREATE_NEW_ACCOUNT, FORGOT_PASSWORD, LOGIN, UPDATE_PASSWORD } from '../../../utils/StringConstants'
import GidInput from '../../custom/Elements/inputs/GidInput'
import PlainButton from '../../custom/Elements/buttons/PlainButton'
import { Link, useNavigate } from 'react-router-dom'
import { routesName } from '../../../config/routesName'
import { decodeToken, isFormValid, notifyErrorMessage, notifySuccessMessage, useQuery } from '../../../utils/Utils'
import { apiAction_social } from '../../../api/api'
import { getTheUpdatePasswordUrl } from '../../../api/urls'


export default function ResetPassword(props) {
    let query = useQuery()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({new_password: null, confirm_password: null, token: null})
    const [queryData, setQueryData] = useState(null)
    
    useEffect(() => {
        let queryData = decodeToken(query.get("token"))
        console.log("Q", queryData)
        setFormData({...formData, token: query.get("token")})
        setQueryData(queryData)
    }, [query])



    const updatePassword = async () => {
        let validation_data = [
            { key: "new_password", message: `Enter Valid password` },
            { key: "confirm_password", validation_data: formData.new_password != formData.confirm_password, message: `Password mismatch!` },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction_social({
                url: getTheUpdatePasswordUrl(),
                method: 'post',
                navigate: navigate,
                // dispatch: dispatch,
                data: { ...formData },
            })
            if (res.success) {
                console.log("res", res)
                navigate(`/auth${routesName.login.path}`)
                notifySuccessMessage(res.status)
            } else {
                notifyErrorMessage(res.detail)
            }
        } else {
            notifyErrorMessage(message)
        }
    }

  return (
    <React.Fragment>
        <div className="relative flex flex-col w-full mb-6 shadow-lg rounded-lg bg-white p-10">
            <CustomLabel label={CHOOSE_A_NEW_PASSWORD} className={"text-2xl text-center text-black font-medium"}></CustomLabel>
            <CustomLabel label={`You are about to reset password for`} className={"text-center text-gray-400 font-medium mt-3"}></CustomLabel>
            <CustomLabel label={`${queryData != null ? queryData.email_id : ""}`} className={"text-center text-black font-semibold"}></CustomLabel>
            <div className="relative w-full flex flex-col mt-5">
                    <CustomLabel label={`New password`} />
                    <GidInput 
                        inputType={"password"} 
                        id={"password"}
                        disable={false} 
                        className={""} 
                        value={formData.new_password ? formData.new_password : ''} 
                        onBlurEvent={() => {}}
                        placeholderMsg = "Enter first name"
                        onTextChange={(event) => { setFormData({ ...formData, new_password: event.target.value }) }}>
                    </GidInput>
                </div>
                <div className="relative w-full flex flex-col mt-3">
                    <CustomLabel label={`Confirm password`} />
                    <GidInput 
                        inputType={"password"} 
                        id={"confirm_password"}
                        disable={false} 
                        className={""} 
                        value={formData.confirm_password ? formData.confirm_password : ''} 
                        onBlurEvent={() => {}}
                        placeholderMsg = "Enter first name"
                        onTextChange={(event) => { setFormData({ ...formData, confirm_password: event.target.value }) }}>
                    </GidInput>
                </div>
                <PlainButton onButtonClick={() => {updatePassword()}} title={UPDATE_PASSWORD} className={"w-full mt-5 bg-blue-600 hover:bg-blue-700"} ></PlainButton>
        </div>

        <div className="flex flex-wrap mt-6 relative">
            <div className="w-1/2">
                <Link to={'/auth' + routesName.login.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.login.path)}>
                    <small>{LOGIN}</small>
                </Link>
            </div>
            <div className="w-1/2 text-right">
                <Link to={'/auth' + routesName.registration.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.registration.path)}>
                    <small>{CREATE_NEW_ACCOUNT}</small>
                </Link>
            </div>
        </div>
    </React.Fragment>
  )
}
