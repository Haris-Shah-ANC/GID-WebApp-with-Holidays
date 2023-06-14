import React from 'react';
import Input from '../../custom/Elements/Input';
import { Link, useNavigate } from 'react-router-dom';
import { routesName } from '../../../config/routesName';
import CustomLabel from '../../custom/Elements/CustomLabel';
import CustomButton from '../../custom/Elements/CustomButton';
import { notifySuccessMessage } from '../../../utils/Utils';

const Registration = () => {
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className="relative flex flex-col w-full mb-6 shadow-lg rounded-lg bg-white">
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
                        <div className="relative w-full">
                            <CustomLabel label={`Email`}/>
                            <Input
                                type="email"
                                placeholder="Enter Email"
                                onChange={(event) => { console.log('===>Email', event.target.value) }}
                            />
                        </div>
                        <div className="text-center mt-5">
                            <Button fullWidth={true} color="facebook" onClick={() => notifySuccessMessage('clicked')} >
                                Reset Password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex flex-wrap mt-6 relative">
                <div className="w-1/2">
                    <Link to={'/auth' + routesName.login.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.resetPassword.path)}>
                        <small>Already have an account? Login</small>
                    </Link>
                </div>

                <div className="w-1/2 text-right">
                    <Link to={'/auth' + routesName.resetPassword.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.resetPassword.path)}>
                        <small>Forgot password?</small>
                    </Link>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Registration;

const socials = [
    { icon: "google", button: { href: "#pablo" } },
    { icon: "facebook", button: { href: "#pablo" } },
]