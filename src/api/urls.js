import { HOST, APP_NAME, ROUTER } from "../config/config"
import { getBusinessInfo } from "../config/cookiesInfo"

//////////////////////////////////////Auth Api's///////////////////////////////////////////////////////
export const login = () => {
    return HOST + APP_NAME + ROUTER + `/login/`
}
export const token_refresh = () => {
    return HOST + APP_NAME + ROUTER + `/token/refresh/`
}

export const register = () => {
    return HOST + APP_NAME + `/register/`
}

export const getTheSendRegistrationMailUrl = () => {
    return HOST + APP_NAME + `/send_registration_mail/`
}


export const getTheForgotPasswordSendLinkUrl = () => {
    return HOST + APP_NAME + `/send_forgot_password_mail/`
}

export const getTheUserRegisterUrl = () => {
    return HOST + APP_NAME + `/user_register`
}

export const getTheUserRegisterWithWorkspaceUrl = () => {
    return HOST + APP_NAME + "/register/"
}

export const getTheUpdatePasswordUrl = () => {
    return HOST + APP_NAME + "/forgot_password/"
}

//////////////////////////////////////Main Api's///////////////////////////////////////////////////////

export const get_workspace = () => {
    return HOST + APP_NAME + `/get_workspace/`
}

export const getMeetingLinkUrl = (work_id) => {
    return HOST + APP_NAME + `/get_meetings_info/?workspace_id=${work_id}`
}
export const addMeetingLinkUrl = () => {
    return HOST + APP_NAME + `/add_meeting_info/`
}

export const get_task = () => {
    return HOST + APP_NAME + `/api/get_task/`
    // return HOST + APP_NAME +`/get_task/?created_at__date__gte=&created_at__date__lte=&workspace=${work_id}&project=${project_id}}&employee=6&status=In-Progress`
}
export const get_task_count_url = (work_id) => {
    return HOST + APP_NAME + `/get_task_count/?workspace_id=${work_id}`
}
export const get_assigned_task = (work_id) => {
    return HOST + APP_NAME + `/get_assigned_task/?workspace_id=${work_id}`
}
export const assign_task = () => {
    return HOST + APP_NAME + `/assign_task/`
}

export const post_task = () => {
    return HOST + APP_NAME + `/post_task/`
}

export const update_task = () => {
    return HOST + APP_NAME + `/update_task/`
}


export const employee = (work_id) => {
    return HOST + APP_NAME + `/employee/?work_id=${work_id}`
}

export const get_all_project = (work_id) => {
    return HOST + APP_NAME + `/get_all_project/?workspace_id=${work_id}`
}

export const get_project_module = (work_id, project_id) => {
    return HOST + APP_NAME + `/get_project_module/?workspace_id=${work_id}&project_id=${project_id}`
}

export const timeline_task = (work_id, employee_id, status_in) => {
    return HOST + APP_NAME + `/timeline_task/?workspace_id=${work_id}&employee_id=${employee_id}&status_in=${status_in}`
}

// export const getTaskListUrl=()=>{
//     return HOST + APP_NAME + `/multifilter_task/`
// }

export const getTheActiveModulesFetchUrl = () => {
    return HOST + APP_NAME + `/get_active_modules/?workspace_id=${1}&project_id=${39}`
}

export const getCreateProjectUrl = () => {
    return HOST + APP_NAME + `/create_project/`
}

export const getTheModuleCreationUrl = () => {
    return HOST + APP_NAME + `/create_project_module/`
}

export const getTheCreateWorkspaceUrl = () => {
    return HOST + APP_NAME + `/create_new_workspace/`
}

export const getThesentInvitationUrl = () => {
    return HOST + APP_NAME + `/send_invite_mail/`
}

export const getTheAttendanceReportUrl = (fromDate, toDate, workId) => {
    return HOST + APP_NAME + `/get_employees_attendance_report/?from_date=${fromDate}&to_date=${toDate}&work_id=${workId}`
}

export const getTheAttendanceReportUploadUrl = () => {
    return HOST + APP_NAME + `/attendance/`
}

//PERIODIC NOTIFICATIONS URLS
export const getThePeriodicNotificationsGetUrl = (work_id) => {
    return HOST + APP_NAME + `/get_periodic_tasks/?workspace_id=${work_id}`
}

export const getTheDeletePeriodicNotificationUrl = () => {
    return HOST + APP_NAME + `/deactivate_periodic_notification/`
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

export const getTheCalendarViewTasksUrl = () => {
    return HOST + APP_NAME + `/api/calendar_task_view/`
    // return HOST + APP_NAME + `/api/calendar_task_view/?dead_line__gte=${fromDate}&dead_line__lte=${endDate}&workspace=${work_id}`
}

//INCOME AND EXPENSE ANALYSIS RELATED API`S
export const getIncomeExpenseDataWithComparison = () => {
    return HOST + APP_NAME + `/income_expense_data/`
}

export const getIncomeExpenseChartsData = () => {
    return HOST + APP_NAME + `/income_expense_chart_data/`
}

export const getIncomeExpensePieChartData = () => {
    return HOST + APP_NAME + `/income_by_project_pie_chart/`
}

export const getTheTimeSheetUploadUrl = () => {
    return HOST + APP_NAME + `/upload_working_data/`
}

export const getTheAddTaskEffortsUrl = () => {
    return HOST + APP_NAME + `/add_task_efforts/`
}

export const getTheListOfTaskEffortsUrl = (workspaceId, taskId) => {
    return HOST + APP_NAME + `/list_of_task_efforts/?workspace_id=${workspaceId}&task_id=${taskId}`
}

export const getDeleteTaskEffortsUrl = () => {
    return HOST + APP_NAME + `/delete_task_efforts/`
}

export const getTasksUrl = () => {
    return HOST + APP_NAME + `/list_of_task_records_of_employee/`
}
