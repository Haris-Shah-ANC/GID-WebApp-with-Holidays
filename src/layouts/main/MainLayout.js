import React, { useContext, useEffect } from "react";
import { routesName } from "../../config/routesName";
import Navbar from "../../components/custom/Navbar/Navbar";
import { mainRoutes } from "../../config/routes";
import * as Actions from '../../state/Actions'

import {
  clearCookie,
  getWorkspaceInfo,
  isAuthenticated,
} from "../../config/cookiesInfo";
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import SidebarContainer from "../../components/custom/Sidebar/SidebarContainer";
import Loader from "../../components/custom/Loaders/Loader";
import ModelComponent from "../../components/custom/Model/ModelComponent";

function MainLayout() {

  const navigate = useNavigate();

  const ProtectedRoute = ({ children }) => {
    // if (false) {
      if (!isAuthenticated()) {
      return <Navigate to={"/auth" + routesName.login.path} replace />;
    }
    return children;
  };

  const [sidebarShow, setSidebarShow] = React.useState("-translate-x-full");
  const state =Actions.getState(useContext)
  const dispatch = Actions.getDispatch(useContext);
  
  
  useEffect(() => {
    dispatch(Actions.stateChange("workspace", getWorkspaceInfo()))
  }, [])

  useEffect(() => {
    console.log("modalVisibility")
  }, [dispatch.modalVisibility])

  const logOutFromTheApp = () => {
    clearCookie()
    navigate("/auth"+routesName.login.path)
  }
  
  const handleDrawerClick = () => {
    if (sidebarShow === "") {
      setSidebarShow("-translate-x-full");
    } else {
      setSidebarShow("");
    }
  };
  return (
    <React.Fragment>

    <div className="flex w-screen h-screen bg-screenBackgroundColor relative">
      <SidebarContainer></SidebarContainer>
      <div className="w-full overflow-auto">
        <Navbar logOutClick={logOutFromTheApp}></Navbar>
        <div className="overflow-x-hidden p-3">
          <Routes>
                {
                  mainRoutes.map((route, index) =>
                    <Route key={index}
                      path={route.path}
                      element={
                        <ProtectedRoute>
                          {route.component}
                        </ProtectedRoute>
                      }
                    />
                  )
                }
              </Routes>
        </div>
        
      </div>
      
    </div>

    </React.Fragment>

  );
}

export default MainLayout;






