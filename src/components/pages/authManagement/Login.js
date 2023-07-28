import React from 'react';
import Input from '../../custom/Elements/Input';
import * as Actions from '../../../state/Actions';
import { Link, useNavigate } from 'react-router-dom';
import Checkbox from '../../custom/Elements/Checkbox';
import { routesName } from '../../../config/routesName';
import { login, get_workspace } from '../../../api/urls';
import CustomLabel from '../../custom/Elements/CustomLabel';
import CustomButton from '../../custom/Elements/CustomButton';
import GidInput from '../../custom/Elements/inputs/GidInput'

import {
    apiAction,
    apiAction_social
} from '../../../api/api';

import {
    setAccessToken,
    setLoginDetails,
    setLoginStatus,
    setWorkspaceInfo,
} from '../../../config/cookiesInfo';

import {
    isFormValid,
    notifyErrorMessage,
    notifySuccessMessage,
} from '../../../utils/Utils';
import PlainButton from '../../custom/Elements/buttons/PlainButton';
import { SIGN_IN } from '../../../utils/StringConstants';



const Login = () => {
    const navigate = useNavigate();
    const dispatch = Actions.getDispatch(React.useContext);

    const initial_data = {
        email: null,
        password: null,
    }
    const [formData, setFormData] = React.useState({ ...initial_data })

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validation_data = [
            { key: "email", message: `Email field left empty!` },
            { key: "password", message: 'Password field left empty!' },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction_social({
                url: login(),
                method: 'post',
                navigate: navigate,
                dispatch: dispatch,
                data: { ...formData },
            })
            if (res.success) {
                setLoginDetails(res);
                setAccessToken(res.access);

                if (res.access) {
                    let res_workspace = await apiAction({
                        url: get_workspace(),
                        method: 'get',
                        navigate: navigate,
                        dispatch: dispatch,
                    })
                    if (res_workspace.success) {
                        setLoginStatus("true");
                        setWorkspaceInfo(res_workspace.result[0]);
                        navigate(routesName.dashboard.path);
                        notifySuccessMessage(`Login Successfully!`)
                    }
                }
            } else {
                notifyErrorMessage(res.detail)
            }
        } else {
            notifyErrorMessage(message)
        }
    }

    return (
        <React.Fragment>
            <div className="relative flex flex-col w-full mb-6 shadow-lg rounded-lg bg-white">
                <div className="mb-0 px-6 py-6">
                    <div className="text-center mb-3">
                        <h6 className="text-blueGray-500 text-sm font-bold">Login with</h6>
                    </div>
                    <div className="text-center">
                        {socials.map((prop, key) => (
                            <CustomButton
                                size="sm"
                                {...prop.button}
                                key={key}
                                color={prop.icon}
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
                        <small>Or login with credentials</small>
                    </div>
                    <form>
                        <div className="relative w-full flex flex-col">
                            <CustomLabel label={`Email`} />
                            <GidInput 
                                inputType={"email"} 
                                id={"email-login"}
                                disable={false} 
                                className={""} 
                                value={formData.email ? formData.email : ''} 
                                onBlurEvent={() => {}}
                                placeholderMsg = "Enter Email"
                                onTextChange={(event) => { setFormData({ ...formData, email: event.target.value }) }}>
                            </GidInput>
                            {/* <Input
                                type="email"
                                placeholder="Enter Email"
                                onChange={(event) => { setFormData({ ...formData, email: event.target.value }) }}
                            /> */}
                        </div>
                        <div className="relative flex flex-col mt-2 w-full">
                            <CustomLabel label={`Password`} />
                            <GidInput 
                                inputType={"password"} 
                                id={"password"}
                                disable={false} 
                                className={""} 
                                value={formData.password ? formData.password : ''} 
                                onBlurEvent={() => {}}
                                placeholderMsg = "Enter Password"
                                onTextChange={(event) => { setFormData({ ...formData, password: event.target.value }) }}>
                            </GidInput>
                            {/* <Input
                                type="password"
                                placeholder="Enter Password"
                                onChange={(event) => { setFormData({ ...formData, password: event.target.value }) }}
                            /> */}
                        </div>

                        <div className="mt-2 inline-block">
                            <Checkbox label={'Remember me'} />
                        </div>
                        
                        <PlainButton onButtonClick={handleSubmit} title={SIGN_IN} className={"w-full mt-5 bg-blue-600 hover:bg-blue-700"} ></PlainButton>
                        {/* <div className="text-center mt-5">
                            <CustomButton fullWidth={true} color="facebook" onClick={handleSubmit} >
                                Sign in
                            </CustomButton>
                        </div> */}
                    </form>
                </div>
            </div>

            <div className="flex flex-wrap mt-6 relative">
                <div className="w-1/2">
                    <Link to={'/auth' + routesName.resetPassword.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.resetPassword.path)}>
                        <small>Forgot password?</small>
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

export default Login;

const socials = [
    { icon: "google", button: { href: "#pablo" } },
    { icon: "facebook", button: { href: "#pablo" } },
]