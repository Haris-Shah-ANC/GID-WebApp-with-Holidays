import Cookies from 'js-cookie'
import { routesName } from './routesName';
import { history } from '../utils/Utils';
////////////////////////////access-token //////////////////////////////////
export const setAccessToken = (token) => {
    Cookies.set('access-token', token);
}
export const getAccessToken = () => {
    return Cookies.get('access-token');
}

///////////////////////////login-detail///////////////////////////////////
export const setLoginDetails = (info) => {
    Cookies.set('login-detail', JSON.stringify(info));
}
export const getLoginDetails = () => {
    if (Cookies.get('login-detail')) {
        return Cookies.get('login-detail') ? JSON.parse(Cookies.get('login-detail')) : null;
    }
}
//////////////////////////////gid-loginStatus////////////////////////////////
export const setLoginStatus = (info) => {
    Cookies.set('gid-loginStatus', info);
}
export const isAuthenticated = () => {

    if (Cookies.get('gid-loginStatus') === "true") {
        return true;
    } else {
        return false;
    }
}

//////////////////////////workspace-info////////////////////////////////////
export const setWorkspaceInfo = (info) => {
    Cookies.set('workspace-info', JSON.stringify(info));
}
export const getWorkspaceInfo = () => {
    if (Cookies.get('workspace-info')) {
        return JSON.parse(Cookies.get('workspace-info'));
    } 
}


//////////////////////////////Clear the store////////////////////////////////
export const clearCookie = () => {
    Cookies.remove('access-token')
    Cookies.remove('login-detail')
    Cookies.remove('workspace-info')
    Cookies.remove('gid-loginStatus')
}