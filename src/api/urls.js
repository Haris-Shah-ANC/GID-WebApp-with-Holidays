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

export const getTheActiveModulesFetchUrl = () => {
    return HOST + APP_NAME + `/get_active_modules/?workspace_id=${1}&project_id=${39}`
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

export const getTheAttendanceReportUrl = (fromDate, toDate, workId) => {
    return HOST + APP_NAME + `/get_employees_attendance_report/?from_date=${fromDate}&to_date=${toDate}&work_id=${workId}`
}

export const getTheAttendanceReportUploadUrl = () => {
    return HOST + APP_NAME + `/attendance/`
}

export const getThePeriodicNotificationsGetUrl = (work_id) => {
    return HOST + APP_NAME + `/get_periodic_tasks/?workspace_id=${work_id}`
}

export const getTheNotificationTypesUrl = (work_id) => {
    return HOST + APP_NAME + `/get_notification_types/?workspace_id=${work_id}`
}

export const getThePeriodScheduleTask = () => {
    return HOST + APP_NAME + `/schedule_periodic_tasks/`
}

export const getTheModuleProgressPeriodicTasksUrl = () => {
    return HOST + APP_NAME + `/schedule_module_progress_periodic_tasks/`
}

export const getTheAttendanceSyncWithRazorPayUrl = (workId, fromDate, toDate) => {
    return HOST + APP_NAME + `/sync_attendance_with_razorpay/?work_id=${workId}&from_date=${fromDate}&to_date=${toDate}`
}

export const getTheCalendarViewTasksUrl = (fromDate, endDate, work_id) => {
    return HOST + APP_NAME + `/api/calendar_task_view/?dead_line__gte=${fromDate}&dead_line__lte=${endDate}&workspace=${work_id}`
}


