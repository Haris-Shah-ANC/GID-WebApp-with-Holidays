import { routesName } from "./routesName";

import Login from "../components/pages/authManagement/Login";
import PasswordRest from "../components/pages/authManagement/PasswordRest";
import Registration from "../components/pages/authManagement/Registration";

import Dashboard from "../components/pages/mainManagement/Dashboard";
import Timeline from "../components/pages/mainManagement/Timeline";
import AssignTask from "../components/pages/mainManagement/AssignTask";

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
        path: routesName.resetPassword.path,
        name: routesName.resetPassword.name,
        component: <PasswordRest />,
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
];
export const landingRoutes = [];

export const sidebarMenu = [
    {
        name: routesName.workSpace.name,
        path: routesName.workSpace.path,
        icon: "fa-solid fa-briefcase",
        active: routesName.workSpace.activeRoute,
        childItem: 'work_space'
    },
    {
        name: routesName.dashboard.name,
        path: routesName.dashboard.path,
        icon: "fa-solid fa-gauge-simple-high",
        active: routesName.dashboard.activeRoute,

    },
    // {
    //     name: routesName.timeLine.name,
    //     path: routesName.timeLine.path,
    //     icon: "fa-solid fa-business-time",
    //     active: routesName.timeLine.activeRoute,
    // },
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
        childItem: 'meeting'
    },
];





