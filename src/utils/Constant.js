///////////////////////////////////////////////////////////////images/////////////////////////////////////////////////////////////////////////////
export const imagesList = {
    appLogo: { src: require('../assets/image/logo.png'), alt: 'logo.png' },
    profile: { src: require('../assets/image/undraw_profile.png'), alt: 'undraw_profile.png' },
    employee_default_img: {src: require('../assets/image/profile.png')},

}

///////////////////////////////////////////////////////////////active colors/////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////Date Formate/////////////////////////////////////////////////////////////////////////////
export const DateFormatCard = 'MMMM D, YYYY, h A';

export const add_task=`add_task`; 
export const create_new_work_space=`create_new_work_space`; 
export const filter_and_sort=`filter_and_sort`;
export const add_project = `add_project`;
export const add_project_module = `add_project_module`;
export const file_upload = "file_upload";
export const delete_notification = "delete_notification";
export const add_meeting_link="add_meeting_link"
export const TASK = "Task"
export const DURATION = "Duration"
export const START_TIME = "Start Time"
export const END_TIME = "End Time"
export const PROJECT = "Project"
export const MODULE = "Module"
export const ROLES = [
    {role: "Employee", short_name: "employee", id:1},
    {role: "Admin", short_name: "admin", id:2},
    {role: "Manager", short_name: "manager", id:3}
]

export const MENU = [
    "Profile",
    "Settings",
    "Activity Log"
]

export const WEEKS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

export const INCOME = "Income"
export const EXPENSE = "Expense"
export const NET_DIFFERENCE = "Net Difference"
export const APP_NAME = ""
export const UN_AUTHORIZED = "UNAUTHORIZED"
export const AUTHORIZED = "AUTHORIZED"
export const MULTIPART = "AUTHORIZED"
export const UPLOAD_FILE = "Upload file"
export const DATE = "Date"

export const svgIcons = (style = "", icon) => {
    const icons = {
        upload: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" className={style}>
            <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3V320c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 53 43 96 96 96H352c53 0 96-43 96-96V352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V352z" />
        </svg>,
        attachment: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" className={style}>
            <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
        </svg>,
        arrow: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" className={style}>
            <path d="M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3V480c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128z" /></svg>,
        timer: <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={style}>
        <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
    }
    return icons[icon]
}