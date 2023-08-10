import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routesName } from '../../../config/routesName';
import CustomLabel from '../../custom/Elements/CustomLabel';
import CustomButton from '../../custom/Elements/CustomButton';
import { isFormValid, notifyErrorMessage, notifySuccessMessage, socials, validateEmail } from '../../../utils/Utils';
import GidInput from '../../custom/Elements/inputs/GidInput';
import PlainButton from '../../custom/Elements/buttons/PlainButton';
import { REGISTER_ACCOUNT } from '../../../utils/StringConstants';
import Card from '../../custom/Elements/Card';
import { apiAction, apiAction_social } from '../../../api/api';
import { getTheSendRegistrationMailUrl } from '../../../api/urls';

const Registration = () => {
    const navigate = useNavigate();
    const initial_data = {
        send_to: null,
    }
    const [formData, setFormData] = React.useState({ ...initial_data })
    const [isEmailSent, setEmailSendStatus] = useState(false)

    const handleSubmit = async () => {
        let validation_data = [
            { key: "send_to", validation: !validateEmail(formData.send_to) , message: `Email field left empty!` },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction_social({
                url: getTheSendRegistrationMailUrl(),
                method: 'post',
                navigate: navigate,
                // dispatch: dispatch,
                data: { ...formData },
            })
            if (res.success) {
                setEmailSendStatus(true)
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
        
            {!isEmailSent && <Card className={""} component={<div>
                <div className="mb-0 px-6 py-6">
                    <div className="text-center mb-3">
                        <h6 className="text-blueGray-500 text-sm font-bold">Register with</h6>
                    </div>
                    <div className="text-center">
                        {socials.map((prop, key) => (
                            <CustomButton
                                size="sm"
                                key={key}
                                color={prop.icon}
                                {...prop.button}
                                fullWidth={false}
                            >
                                <i className={"mr-1 fab fa-" + prop.icon}></i> {prop.icon}
                            </CustomButton>
                        ))}
                    </div>
                    <hr className="mt-6 border-b-1 border-blueGray-200" />
                </div>

                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <div className="text-blueGray-500 text-center mb-3 font-bold">
                        <small>Or Register using Email</small>
                    </div>
                    <form>
                        <div className="relative w-full flex flex-col">
                            <CustomLabel label={`Email`}/>
                            <GidInput 
                                inputType={"email"} 
                                id={"email-registration"}
                                disable={false} 
                                className={""} 
                                value={formData.send_to ? formData.send_to : ''} 
                                onBlurEvent={() => {}}
                                placeholderMsg = "Enter Email"
                                onTextChange={(event) => { setFormData({ ...formData, send_to: event.target.value }) }}>
                            </GidInput>
                        </div>
                        <div className="text-center mt-5">
                            <PlainButton onButtonClick={() => {handleSubmit()}} title={REGISTER_ACCOUNT} className={"w-full mt-5 bg-blue-600 hover:bg-blue-700"} ></PlainButton>
                        </div>
                    </form>
                </div>
            </div>}>
            </Card>}

             {isEmailSent && <Card className={"p-0 flex rounded-md"}
                component={<EmailSent></EmailSent>}></Card>}
    

            <div className="flex flex-wrap mt-6 relative">
                <div className="w-1/2">
                    <Link to={'/auth' + routesName.login.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.login.path)}>
                        <small>Already have an account? Login</small>
                    </Link>
                </div>

                <div className="w-1/2 text-right">
                    <Link to={'/auth' + routesName.forgot_password.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.forgot_password.path)}>
                        <small>Forgot password?</small>
                    </Link>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Registration;


const EmailSent = (props) => {

    return (<div className='flex flex-col'>
        {/* <img src='https://source.unsplash.com/Mv9hjnEUHR4/600x800' alt='' className='h-80'></img> */}
        <div className='w-full flex flex-col h-48 font-quicksand'>
            <div className='h-full justify-center items-center flex'>
                <span className='font-medium'>Create an Account!</span>
            </div>
            <div className='h-full flex flex-col'>
                <span className='flex font-semibold text-2xl self-center text-gray-500'>Check your mail to complete Registration</span>
            </div>
        </div>
    </div>)
}