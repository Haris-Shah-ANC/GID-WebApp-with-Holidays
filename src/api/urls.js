import { HOST, APP_NAME,ROUTER } from "../config/config"
import { getBusinessInfo } from "../config/cookiesInfo"

//////////////////////////////////////Auth Api's///////////////////////////////////////////////////////
export const login = () => {
    return HOST + APP_NAME + ROUTER +  `/login/`
}
export const token_refresh = () => {
    return HOST + APP_NAME + ROUTER +  `/token/refresh/`
}

export const register = () => {
    return HOST + APP_NAME +  `/register/`
}

//////////////////////////////////////Main Api's///////////////////////////////////////////////////////

export const get_workspace = () => {
    return HOST + APP_NAME +  `/get_workspace/`
}

export const get_task = (work_id) => {
    return HOST + APP_NAME +  `/get_task/?work_id=${work_id}`
}

export const get_assigned_task = (work_id) => {
    return HOST + APP_NAME +  `/get_assigned_task/?workspace_id=${work_id}`
}
export const assign_task = () => {
    return HOST + APP_NAME +  `/assign_task/`
}

export const post_task = () => {
    return HOST + APP_NAME +  `/post_task/`
}

export const update_task = () => {
    return HOST + APP_NAME +  `/update_task/`
}


export const employee = (work_id) => {
    return HOST + APP_NAME +  `/employee/?work_id=${work_id}`
}

export const get_all_project = (work_id) => {
    return HOST + APP_NAME +  `/get_all_project/?workspace_id=${work_id}`
}

export const get_project_module = (work_id,project_id) => {
    return HOST + APP_NAME +  `/get_project_module/?workspace_id=${work_id}&project_id=${project_id}`
}

export const timeline_task = (work_id,employee_id,status_in) => {
    return HOST + APP_NAME +  `/timeline_task/?workspace_id=${work_id}&employee_id=${employee_id}&status_in=${status_in}`
}

export const getTaskListUrl=()=>{
    return HOST + APP_NAME + `/multifilter_task/`
}

export const getCreateProjectUrl =() => {
    return HOST + APP_NAME +  `/create_project/`
}

export const getTheModuleCreationUrl = () => {
    return HOST + APP_NAME + `/create_project_module/`
}

export const getTheCreateWorkspaceUrl =() => {
    return HOST + APP_NAME + `/create_new_workspace/`
}

export const getThesentInvitationUrl = () =>{
    return HOST + APP_NAME + `/send_invite_mail/`
}






