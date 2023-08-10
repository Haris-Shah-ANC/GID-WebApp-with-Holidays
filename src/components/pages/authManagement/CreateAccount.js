import React, { useEffect, useMemo, useState } from 'react'
import CustomButton from '../../custom/Elements/CustomButton';
import CustomLabel from '../../custom/Elements/CustomLabel';
import GidInput from '../../custom/Elements/inputs/GidInput';
import Checkbox from '../../custom/Elements/buttons/Checkbox';
import PlainButton from '../../custom/Elements/buttons/PlainButton';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { routesName } from '../../../config/routesName';
import { decodeToken, isFormValid, notifyErrorMessage, notifySuccessMessage, socials } from '../../../utils/Utils';
import { apiAction, apiAction_social } from '../../../api/api';
import { employee, getTheUserRegisterUrl, getTheUserRegisterWithWorkspaceUrl, get_workspace } from '../../../api/urls';
import IconInput from '../../custom/Elements/inputs/IconInput';
import { setAccessToken, setLoginDetails, setLoginStatus, setWorkspaceInfo } from '../../../config/cookiesInfo';

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

export default function CreateAccount() {
    let query = useQuery()
    const navigate = useNavigate()
    const initial_data = {
        email_id: null,
        password: null,
        confirmPassword: null,
        first_name: null,
        last_name: null,
        employee_name: null,
        token: null
    }
    const [formData, setFormData] = useState({ ...initial_data })
    const [showWorkspaceForm, setWorkspaceVisibility] = useState(false)
    const [workspaceFormData, setWorkspaceFormData] = useState({workspace_name: null, office_start_time: null, office_end_time: null})
    
    useEffect(() => {
        const userInfo = decodeToken(query.get("token"))
        console.log(userInfo)
        setFormData({...formData, email_id: userInfo.email_id, token: query.get("token")})
    }, [])


    const handleSubmit = async () => {
        let validation_data = [
            { key: "first_name", message: `First name field left empty!` },
            { key: "last_name", message: `Last name field left empty!` },
            { key: "password", message: `Password field left empty!` },
            { key: "confirm_password", validation: formData.password != formData.confirmPassword, message: `Password mismatch.`}
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            // let res = await apiAction_social({
            //     url: getTheUserRegisterUrl(),
            //     method: 'post',
            //     navigate: navigate,
            //     // dispatch: dispatch,
            //     data: { ...formData },
            // })
            // if (res.success) {
                
            //    notifySuccessMessage(res.status)
            // } else {
            //     notifyErrorMessage(res.detail)
            // }
            setFormData({...formData, employee_name: `${formData.first_name} ${formData.last_name}`})
            setWorkspaceVisibility(true)
        } else {
            notifyErrorMessage(message)
        }
    }

    const createWorkspace = async () => {
        let validation_data = [
            { key: "workspace_name", message: `Workspace field left empty!` },
            { key: "office_start_time", message: `Office start time field left empty!` },
            { key: "office_end_time", message: `Office end time field left empty!` },
        ]
        const { isValid, message } = isFormValid(workspaceFormData, validation_data);
        if (isValid) {
            let res = await apiAction_social({
                url: getTheUserRegisterWithWorkspaceUrl(),
                method: 'post',
                navigate: navigate,
                // dispatch: dispatch,
                data: { ...formData, ...workspaceFormData },
            })
            if (res.success) {
                setLoginDetails(res);
                setAccessToken(res.access);

                if (res.access) {
                    let res_workspace = await apiAction({
                        url: get_workspace(),
                        method: 'get',
                        navigate: navigate,
                        // dispatch: dispatch,
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
            setWorkspaceVisibility(true)
        } else {
            notifyErrorMessage(message)
        }
    }

  return (
    <React.Fragment>
    <div className="relative flex flex-col w-full mb-6 shadow-lg rounded-lg bg-white">
        <div className="mb-0 px-6 py-6">
            <div className="text-center mb-3">
                <h6 className="text-blueGray-500 text-sm font-bold">Create Account</h6>
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
            {/* <div className="text-blueGray-500 text-center mb-3 font-bold">
                <small>Or login with credentials</small>
            </div> */}
            {!showWorkspaceForm && <form>
                <div className="relative w-full flex flex-col">
                    <CustomLabel label={`First Name`} />
                    <GidInput 
                        inputType={"text"} 
                        id={"first_name"}
                        disable={false} 
                        className={""} 
                        value={formData.first_name ? formData.first_name : ''} 
                        onBlurEvent={() => {}}
                        placeholderMsg = "Enter first name"
                        onTextChange={(event) => { setFormData({ ...formData, first_name: event.target.value }) }}>
                    </GidInput>
                </div>
                <div className="relative w-full flex flex-col mt-2">
                    <CustomLabel label={`Last Name`} />
                    <GidInput 
                        inputType={"text"} 
                        id={"last_name"}
                        disable={false} 
                        className={""} 
                        value={formData.last_name ? formData.last_name : ''} 
                        onBlurEvent={() => {}}
                        placeholderMsg = "Enter last name"
                        onTextChange={(event) => { setFormData({ ...formData, last_name: event.target.value }) }}>
                    </GidInput>
                </div>
                <div className="relative w-full flex flex-col mt-2">
                    <CustomLabel label={`Email`} />
                    <GidInput 
                        inputType={"email"} 
                        id={"email-login"}
                        disable={true} 
                        className={"bg-blueGray-100 text-gray-500"} 
                        value={formData.email_id ? formData.email_id : ''} 
                        onBlurEvent={() => {}}
                        placeholderMsg = "Enter Email"
                        onTextChange={(event) => { setFormData({ ...formData, email_id: event.target.value }) }}>
                    </GidInput>
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
                </div>
                <div className="relative flex flex-col mt-2 w-full">
                    <CustomLabel label={`Confirm Password`} />
                    <GidInput 
                        inputType={"password"} 
                        id={"re-enter-password"}
                        disable={false} 
                        className={""} 
                        value={formData.confirmPassword ? formData.confirmPassword : ''} 
                        onBlurEvent={() => {}}
                        placeholderMsg = "Enter Password"
                        onTextChange={(event) => { setFormData({ ...formData, confirmPassword: event.target.value }) }}>
                    </GidInput>
                </div>

                {/* <div className="mt-2 inline-block">
                    <Checkbox label={'Remember me'} />
                </div> */}
                
                <PlainButton onButtonClick={handleSubmit} title={"Next"} className={"w-full mt-5 bg-blue-600 hover:bg-blue-700"} ></PlainButton>
                
            </form>}


            {showWorkspaceForm && <form>
                <div className="relative w-full flex flex-col">
                    <CustomLabel label={`Workspace Name`} />
                    
                    <GidInput 
                        inputType={"text"} 
                        id={"workspace-name"}
                        disable={false} 
                        className={""} 
                        value={workspaceFormData.workspace_name ? workspaceFormData.workspace_name : ''} 
                        onBlurEvent={() => {}}
                        placeholderMsg = "Enter Workspace name"
                        onTextChange={(event) => { 
                            setWorkspaceFormData({ ...workspaceFormData, workspace_name: event.target.value }) 
                            }}>
                    </GidInput>
                </div>
                
                <div className="flex w-full gap-5">
                    <div className="relative w-full flex flex-col mt-2">
                        <CustomLabel label={`Clock in`} />
                        <IconInput
                            id={"clock_in_time"}
                            inputType={"time"}
                            disable={false}
                            className={``}
                            value={workspaceFormData.office_start_time ? workspaceFormData.office_start_time : ""}
                            onTextChange={(e) => setWorkspaceFormData((previous) => ({ ...previous, office_start_time: e.target.value }))}
                            onBlurEvent={() => {}}
                            placeholder={""}
                            isRightIcon={true}
                            >
                        </IconInput>
                    </div>
                    <div className="relative flex flex-col mt-2 w-full">
                        <CustomLabel label={`Clock Out`} />
                        <IconInput
                            id={"clock_out_time"}
                            inputType={"time"}
                            disable={false}
                            className={``}
                            value={workspaceFormData.office_end_time ? workspaceFormData.office_end_time : ""}
                            onTextChange={(e) => setWorkspaceFormData((previous) => ({ ...previous, office_end_time: e.target.value }))}
                            onBlurEvent={() => {}}
                            placeholder={""}
                            isRightIcon={true}
                            >
                        </IconInput>
                    </div>
                </div>
                
                <PlainButton onButtonClick={() => {setWorkspaceVisibility(false)}} title={"Previous"} className={"w-full mt-5 bg-gray-400 text-white hover:bg-blue-700"} ></PlainButton>
                <PlainButton onButtonClick={createWorkspace} title={"Submit"} className={"w-full mt-5 bg-blue-600 hover:bg-blue-700"} ></PlainButton>
                
            </form>}
        </div>
    </div>

    <div className="flex flex-wrap mt-6 relative">
        <div className="w-1/2">
            <Link to={'/auth' + routesName.forgot_password.path} className="text-white font-semibold hover:underline" onClick={() => navigate('/auth' + routesName.forgot_password.path)}>
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


