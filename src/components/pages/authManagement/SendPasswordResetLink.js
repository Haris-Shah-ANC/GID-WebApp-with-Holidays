import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routesName } from '../../../config/routesName';
import { isFormValid, notifyErrorMessage, notifySuccessMessage, validateEmail } from '../../../utils/Utils';
import CustomLabel from '../../custom/Elements/CustomLabel';
import CustomButton from '../../custom/Elements/CustomButton';
import GidInput from '../../custom/Elements/inputs/GidInput';
import PlainButton from '../../custom/Elements/buttons/PlainButton';
import { RESET_PASSWORD } from '../../../utils/StringConstants';
import { apiAction_social } from '../../../api/api';
import { getTheForgotPasswordSendLinkUrl } from '../../../api/urls';

const SendPasswordResetLink = () => {
    const navigate = useNavigate();
    const initial_data = {
        send_to: null,
    }
    const [formData, setFormData] = React.useState({ ...initial_data })
    const [isLinkSent, setLinkSentStatus] = useState(false)

    const onPasswordResetClick = async () => {
        let validation_data = [
            { key: "send_to", validation: !validateEmail(formData.send_to), message: `Enter valid email.` },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction_social({
                url: getTheForgotPasswordSendLinkUrl(),
                method: 'post',
                navigate: navigate,
                // dispatch: dispatch,
                data: { ...formData },
            })
            if (res.success) {
                setLinkSentStatus(true)
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
            {!isLinkSent && <div>
                <div className="relative flex flex-col w-full mb-6 shadow-lg rounded-lg bg-white">
                    <div className="lg:p-10 px-4 py-4 flex-auto rounded-b-lg">
                        <h4 className="text-2xl font-bold text-center">Forgot Your Password?</h4>
                        <div className="text-center text-blueGray-500 mb-5 mt-1">
                            <p>We get it, stuff happens. Just enter your email address below and we'll send you a link to reset your password!</p>
                        </div>
                        <form>
                            <div className="relative w-full flex flex-col">
                                <CustomLabel label={`Email`}/>
                                <GidInput 
                                    inputType={"email"} 
                                    id={"email-pass-reset"}
                                    disable={false} 
                                    className={""} 
                                    value={formData.send_to ? formData.send_to : ''} 
                                    onBlurEvent={() => {}}
                                    placeholderMsg = "Enter Email"
                                    onTextChange={(event) => { setFormData({ ...formData, send_to: event.target.value }) }}>
                                </GidInput>
                            </div>

                                <PlainButton onButtonClick={onPasswordResetClick} title={RESET_PASSWORD} className={"w-full mt-5 bg-blue-600 hover:bg-blue-700"} ></PlainButton>
                        </form>
                    </div>
                </div>

                <div className="flex flex-wrap mt-6 relative">
                    <div className="w-1/2 ">
                        <Link to={'/auth' + routesName.login.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.login.path)}>
                            <small>Already have an account? Login</small>
                        </Link>
                    </div>

                    <div className="w-1/2 text-right">
                        <Link to={'/auth' + routesName.registration.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.registration.path)}>
                            <small>Create new account</small>
                        </Link>
                    </div>
                </div>
            </div>}


            {
                isLinkSent &&
                <div>
                    <div className="relative flex flex-col w-full mb-6">
                        <div className="lg:p-10 px-4 py-4 flex-auto rounded-b-lg">
                            <h2 className="text-2xl font-medium text-center text-white">Sent to mail</h2>
                            <div className="text-center text-2xl font-quicksand font-semibold mb-5 mt-1 text-yellow-400">
                                <p>{`Password link sent to ${formData.send_to ? formData.send_to : ""} mail please check.`}</p>
                            </div>
                                <div className="items-center flex">
                                    <svg
                                        fill="white"
                                        viewBox="0 0 16 16"
                                        height="1em"
                                        width="1em"
                                        className='mt-1'
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M15 8a.5.5 0 00-.5-.5H2.707l3.147-3.146a.5.5 0 10-.708-.708l-4 4a.5.5 0 000 .708l4 4a.5.5 0 00.708-.708L2.707 8.5H14.5A.5.5 0 0015 8z"
                                        />
                                    </svg>
                                    <Link to={'/auth' + routesName.login.path} className="text-white font-semibold hover:underline pl-2" onClick={() => navigate('/auth' + routesName.login.path)}>
                                        <small>Back to Login</small>
                                    </Link>
                                </div>
                        </div>
                    </div>

                </div>
            }
        </React.Fragment>
    )
}

export default SendPasswordResetLink