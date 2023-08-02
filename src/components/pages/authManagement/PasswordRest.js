import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routesName } from '../../../config/routesName';
import { notifySuccessMessage } from '../../../utils/Utils';
import CustomLabel from '../../custom/Elements/CustomLabel';
import CustomButton from '../../custom/Elements/CustomButton';
import GidInput from '../../custom/Elements/inputs/GidInput';
import PlainButton from '../../custom/Elements/buttons/PlainButton';
import { RESET_PASSWORD } from '../../../utils/StringConstants';

const PasswordRest = () => {
    const navigate = useNavigate();
    const initial_data = {
        email: null,
    }
    const [formData, setFormData] = React.useState({ ...initial_data })

    return (
        <React.Fragment>
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
                                value={formData.email ? formData.email : ''} 
                                onBlurEvent={() => {}}
                                placeholderMsg = "Enter Email"
                                onTextChange={(event) => { setFormData({ ...formData, email: event.target.value }) }}>
                            </GidInput>
                        </div>

                            <PlainButton onButtonClick={() => {notifySuccessMessage('clicked')}} title={RESET_PASSWORD} className={"w-full mt-5 bg-blue-600 hover:bg-blue-700"} ></PlainButton>
                    </form>
                </div>
            </div>

            <div className="flex flex-wrap mt-6 relative">
                <div className="w-1/2 ">
                    <Link to={'/auth' + routesName.login.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.resetPassword.path)}>
                        <small>Already have an account? Login</small>
                    </Link>
                </div>

                <div className="w-1/2 text-right">
                    <Link to={'/auth' + routesName.registration.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.registration.path)}>
                        <small>Create new account</small>
                    </Link>
                </div>


            </div>
        </React.Fragment>
    )
}

export default PasswordRest