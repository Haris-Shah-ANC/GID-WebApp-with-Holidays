import React from 'react';
import Input from '../../custom/Elements/Input';
import { Link, useNavigate } from 'react-router-dom';
import { routesName } from '../../../config/routesName';
import { notifySuccessMessage } from '../../../utils/Utils';
import CustomLabel from '../../custom/Elements/CustomLabel';
import CustomButton from '../../custom/Elements/CustomButton';

const PasswordRest = () => {
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className="relative flex flex-col w-full mb-6 shadow-lg rounded-lg bg-white">
                <div className="lg:p-10 px-4 py-4 flex-auto rounded-b-lg">
                    <h4 className="text-2xl font-bold text-center">Forgot Your Password?</h4>
                    <div className="text-center text-blueGray-500 mb-5 mt-1">
                        <p>We get it, stuff happens. Just enter your email address below and we'll send you a link to reset your password!</p>
                    </div>
                    <form>
                        <div className="relative w-full">
                            <CustomLabel label={`Email`}/>
                            <Input
                                type="email"
                                placeholder="Enter Email"
                                onChange={(event) => { console.log('===>Email', event.target.value) }}
                            />
                        </div>
                        <div className="text-center mt-5">
                            <CustomButton fullWidth={true} color="facebook" onClick={() => notifySuccessMessage('clicked')} >
                                Reset Password
                            </CustomButton>
                        </div>
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