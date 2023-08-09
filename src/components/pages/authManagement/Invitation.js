import React, { useEffect, useState } from 'react'
import { decodeToken, isFormValid, notifyErrorMessage, notifySuccessMessage, socials, useQuery, validateEmail } from '../../../utils/Utils'
import Card from '../../custom/Elements/Card'
import CustomButton from '../../custom/Elements/CustomButton';
import CustomLabel from '../../custom/Elements/CustomLabel';
import GidInput from '../../custom/Elements/inputs/GidInput';
import PlainButton from '../../custom/Elements/buttons/PlainButton';
import { apiAction, apiAction_social } from '../../../api/api';
import { getTheUserRegisterWithWorkspaceUrl, get_workspace } from '../../../api/urls';
import { setAccessToken, setLoginDetails, setLoginStatus, setWorkspaceInfo } from '../../../config/cookiesInfo';
import { useNavigate } from 'react-router-dom';
import { routesName } from '../../../config/routesName';

export default function Invitation(props) {
    let query = useQuery()
    const navigate = useNavigate()
    const [queryData, setQueryData] = useState(null)

    useEffect(() => {
        let info = decodeToken(query.get("token"))
        console.log("Q", info)
        // setFormData({...formData, token: query.get("token")})
        setQueryData(info)
    }, [query])


  return (
    <React.Fragment>
        
        { queryData && !queryData.isUserRegistered && <Card className={"p-5"} component={<InviteNewEmployee queryData={queryData} token={query.get("token")} />}></Card> }

        { queryData && queryData.isUserRegistered && <Card className={"p-5"} component={<AddEmployee queryData={queryData} token={query.get("token")} />}></Card> }

    </React.Fragment>
  )
}


const InviteNewEmployee = (props) => {
    const {queryData, token} = props
    const navigate = useNavigate()
    const initial_data = {
        email_id: null,
        password: null,
        confirmPassword: null,
        first_name: null,
        last_name: null,
        employee_name: null,
        token: token
    }
    const [formData, setFormData] = useState({...initial_data})

    useEffect(() => {
        if(queryData){
            setFormData({...formData, workspace_name: queryData.workspace_name, email_id: queryData.email_id})
        }
    }, [queryData])

    const createWorkspace = async () => {
        let validation_data = [
            { key: "first_name", message: `First name field left empty!` },
            { key: "last_name", message: `Last name field left empty!` },
            { key: "workspace_name", message: `Workspace field left empty!` },
            { key: "password", message: `Password field left empty!` },
            { key: "confirm_password", validation: formData.password != formData.confirmPassword, message: `Password mismatch!` },
        ]
        formData.employee_name = `${formData.first_name} ${formData.last_name}`
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction_social({
                url: getTheUserRegisterWithWorkspaceUrl(),
                method: 'post',
                navigate: navigate,
                // dispatch: dispatch,
                data: {...formData },
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
        } else {
            notifyErrorMessage(message)
        }
    }

    return (
        <div className="mb-0 px-6 py-6">
            <div className="text-center mb-3">
                <CustomLabel className="text-blueGray-500 text-sm font-bold" label={`You are Invited! Create an Account to Join ${queryData ? queryData.workspace_name : ""} Workspace`}></CustomLabel>
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

            <form>
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

                <div className="relative flex flex-col mt-2 w-full">
                    <CustomLabel label={`Workspace`} />
                    <GidInput 
                        inputType={"text"} 
                        id={"workspace-name"}
                        disable={true} 
                        className={"bg-blueGray-100 text-gray-500"} 
                        value={formData.workspace_name ? formData.workspace_name : ''} 
                        onBlurEvent={() => {}}
                        placeholderMsg = "Enter Password"
                        onTextChange={(event) => { setFormData({ ...formData, confirmPassword: event.target.value }) }}>
                    </GidInput>
                </div>

                <PlainButton onButtonClick={createWorkspace} title={"Submit"} className={"w-full mt-5 bg-blue-600 hover:bg-blue-700"} ></PlainButton>
                
            </form>

            <hr className="mt-6 border-b-1 border-blueGray-200" />
        </div>
    )
}


const AddEmployee = (props) => {
    const { queryData, token } = props
    const navigate = useNavigate()
    const [formData, setFormData] = useState({workspace_name: "", password: null, email_id: null, token: token})

    useEffect(() => {
        if(queryData){
            setFormData({...formData, workspace_name: queryData.workspace_name, email_id: queryData.email_id})
        }
    }, [queryData])


    const createWorkspace = async () => {
        let validation_data = [
            { key: "workspace_name", message: `Workspace field left empty!` },
            { key: "email_id", validation: !validateEmail(formData.email_id), message: `Email field left empty!` },
            { key: "password", message: `Password field left empty!` },
        ]
        const { isValid, message } = isFormValid(formData, validation_data);
        if (isValid) {
            let res = await apiAction_social({
                url: getTheUserRegisterWithWorkspaceUrl(),
                method: 'post',
                navigate: navigate,
                // dispatch: dispatch,
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
                notifyErrorMessage(res.status)
            }
        } else {
            notifyErrorMessage(message)
        }
    }

    return (
        <div className="mb-0 px-6 py-6">
            <div className="text-center mb-3">
                <CustomLabel className="text-blueGray-500 text-sm font-bold" label={`You are Invited! Create an Account to Join ${queryData ? queryData.workspace_name : ""} Workspace`}></CustomLabel>
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

            <form>
                <div className="relative flex flex-col mt-2 w-full">
                    <CustomLabel label={`Workspace`} />
                    <GidInput 
                        inputType={"text"} 
                        id={"workspace-name"}
                        disable={true} 
                        className={"bg-blueGray-100 text-gray-500"} 
                        value={formData.workspace_name ? formData.workspace_name : ''} 
                        onBlurEvent={() => {}}
                        placeholderMsg = "Enter Password"
                        onTextChange={(event) => { setFormData({ ...formData, workspace_name: event.target.value }) }}>
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

                <PlainButton onButtonClick={createWorkspace} title={"Accept"} className={"w-full mt-5 bg-blue-600 hover:bg-blue-700"} ></PlainButton>
                
            </form>

            <hr className="mt-6 border-b-1 border-blueGray-200" />
        </div>
    )
}