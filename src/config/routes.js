import { routesName } from "./routesName";

import Login from "../components/pages/authManagement/Login";
import SendPasswordResetLink from "../components/pages/authManagement/SendPasswordResetLink";
import Registration from "../components/pages/authManagement/Registration";

import Dashboard from "../components/pages/mainManagement/Dashboard";
import Timeline from "../components/pages/mainManagement/Timeline";
import AssignTask from "../components/pages/mainManagement/AssignTask";
import InviteToWorkspace from "../components/pages/mainManagement/InviteToWorkspace";
import AttendanceReport from "../components/pages/mainManagement/AttendanceReport";
import Analytics from "../components/pages/mainManagement/Analytics";
import CalendarView from "../components/pages/mainManagement/CalendarView";
import CreateAccount from "../components/pages/authManagement/CreateAccount";
import ResetPassword from "../components/pages/authManagement/ResetPassword";
import Invitation from "../components/pages/authManagement/Invitation";
import Budget from "../components/pages/mainManagement/income_expense/Budget";
import Analysis from "../components/pages/mainManagement/income_expense/Analysis";
import Tasks from "../components/pages/mainManagement/tasks/Tasks";
import Alerts from "../components/pages/mainManagement/Alerts";

export const authRoutes = [
    {
        path: routesName.registration.path,
        name: routesName.registration.name,
        component: <Registration />,
    },
    {
        path: routesName.login.path,
        name: routesName.login.name,
        component: <Login />,
    },
    {
        path: routesName.forgot_password.path,
        name: routesName.forgot_password.name,
        component: <SendPasswordResetLink />,
    },
    {
        path: routesName.create_account.path,
        name: routesName.create_account.name,
        component: <CreateAccount />,
    },
    {
        path: routesName.set_password.path,
        name: routesName.set_password.name,
        component: <ResetPassword />,
    },

    {
        path: routesName.invitation.path,
        name: routesName.invitation.name,
        component: <Invitation />,
    },
];
export const mainRoutes = [
    {
        path: routesName.dashboard.path,
        name: routesName.dashboard.name,
        component: <Dashboard />,
    },
    {
        path: routesName.timeLine.path,
        name: routesName.timeLine.name,
        component: <Timeline />,
    },
    {
        path: routesName.assignTask.path,
        name: routesName.assignTask.name,
        component: <AssignTask />,
    },
    {
        path: routesName.inviteToWorkspace.path,
        name: routesName.inviteToWorkspace.name,
        component: <InviteToWorkspace />,
    },
    {
        path: routesName.reports.path,
        name: routesName.reports.name,
        component: <AttendanceReport />,
    },
    {
        path: routesName.analytics.path,
        name: routesName.analytics.name,
        component: <Analytics />,
    },
    {
        path: routesName.calendar.path,
        name: routesName.calendar.name,
        component: <CalendarView />,
    },
    {
        path: routesName.analysis.path,
        name: routesName.analysis.name,
        component: <Analysis />,
    },
    {
        path: routesName.budget.path,
        name: routesName.budget.name,
        component: <Budget />,
    },

    {
        path: routesName.tasks.path,
        name: routesName.tasks.name,
        component: <Tasks />,
    },
    {
        path: routesName.alerts.path,
        name: routesName.alerts.name,
        component: <Alerts />,
    },
];
export const landingRoutes = [];

export const sidebarMenu = (isAdminMenu) => {
    return isAdminMenu === "Admin" ? [
        {
            name: routesName.workSpace.name,
            path: routesName.workSpace.path,
            icon: "fa-solid fa-briefcase",
            active: routesName.workSpace.activeRoute,
            childItem: 'work_space',
        },
        {
            name: routesName.dashboard.name,
            path: routesName.dashboard.path,
            icon: "fa-solid fa-gauge-simple-high",
            active: routesName.dashboard.activeRoute,

        },
       
        {
            name: routesName.calendar.name,
            path: routesName.calendar.path,
            icon: "fa-solid fa-calendar-days",
            active: routesName.calendar.activeRoute,
        },
        {
            name: routesName.assignTask.name,
            path: routesName.assignTask.path,
            icon: "fa-solid fa-user-plus",
            active: routesName.assignTask.activeRoute,
        },
        {
            name: routesName.newProject.name,
            path: routesName.newProject.path,
            icon: "fa-solid fa-folder-plus",
            active: routesName.newProject.activeRoute,
        },
        {
            name: routesName.newModule.name,
            path: routesName.newModule.path,
            icon: "fa-solid fa-paste",
            active: routesName.newModule.activeRoute,
        },

        {
            name: routesName.inviteToWorkspace.name,
            path: routesName.inviteToWorkspace.path,
            icon: "fa-solid fa-envelope",
            active: routesName.inviteToWorkspace.activeRoute,
        },

        {
            name: routesName.reports.name,
            path: routesName.reports.path,
            icon: "fa-solid fa-file-invoice",
            active: routesName.reports.activeRoute,
            childItem: 'hrms',
        },
      

        {
            name: routesName.analytics.name,
            path: routesName.analytics.path,
            icon: "fa-solid fa-chart-line",
            active: routesName.analytics.activeRoute,
        },

        {
            name: routesName.meeting.name,
            path: routesName.meeting.path,
            icon: "fa-solid fa-video",
            active: routesName.meeting.activeRoute,
            childItem: 'meeting',
        },

     

    ] :
        [
           
           
            {
                name: routesName.workSpace.name,
                path: routesName.workSpace.path,
                icon: "fa-solid fa-briefcase",
                active: routesName.workSpace.activeRoute,
                childItem: 'work_space',
            },
            {
                name: routesName.dashboard.name,
                path: routesName.dashboard.path,
                icon: "fa-solid fa-gauge-simple-high",
                active: routesName.dashboard.activeRoute,

            },
            {
                name: routesName.alerts.name,
                path: routesName.alerts.path,
                icon: "fa-solid fa-bell",
                active: routesName.alerts.activeRoute,

            },
           
            {
                name: routesName.calendar.name,
                path: routesName.calendar.path,
                icon: "fa-solid fa-calendar-days",
                active: routesName.calendar.activeRoute,
                accessibleToEmployee: false
            },
            // {
            //     name: routesName.reports.name,
            //     path: routesName.reports.path,
            //     icon: "fa-solid fa-file-invoice",
            //     active: routesName.reports.activeRoute,
            //     childItem: 'hrms',
            // },
            {
                name: routesName.analysis.name,
                path: routesName.analysis.path,
                icon: "fa-solid fa-file-invoice",
                active: routesName.analysis.activeRoute,
                childItem: 'analysis',
            },
            {
                name: routesName.assignTask.name,
                path: routesName.assignTask.path,
                icon: "fa-solid fa-user-plus",
                active: routesName.assignTask.activeRoute,
            },
            {
                name: routesName.newProject.name,
                path: routesName.newProject.path,
                icon: "fa-solid fa-folder-plus",
                active: routesName.newProject.activeRoute,
            },
            {
                name: routesName.newModule.name,
                path: routesName.newModule.path,
                icon: "fa-solid fa-paste",
                active: routesName.newModule.activeRoute,
            },


            {
                name: routesName.meeting.name,
                path: routesName.meeting.path,
                icon: "fa-solid fa-video",
                active: routesName.meeting.activeRoute,
                childItem: 'meeting',
            },

        ];

}




