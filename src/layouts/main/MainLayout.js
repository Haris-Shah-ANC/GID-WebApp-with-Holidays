import React, { useContext, useEffect } from "react";
import { routesName } from "../../config/routesName";
import Navbar from "../../components/custom/Navbar/Navbar";
import { mainRoutes, sidebarMenu } from "../../config/routes";
import Sidebar from "../../components/custom/Sidebar/Sidebar";
import * as Actions from '../../state/Actions'

import {
  clearCookie,
  getToken,
  getWorkspaceInfo,
  isAuthenticated,
} from "../../config/cookiesInfo";
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

function MainLayout() {

  const navigate = useNavigate();

  const ProtectedRoute = ({ children }) => {
    // if (false) {
      if (!isAuthenticated()) {
      return <Navigate to={"/auth" + routesName.login.path} replace />;
    }
    return children;
  };



  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [sidebarShow, setSidebarShow] = React.useState("-translate-x-full");
  const dispatch = Actions.getDispatch(useContext);
  
  
  useEffect(() => {
    dispatch(Actions.stateChange("workspace", getWorkspaceInfo()))
  }, [])

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
      {/* <div className="flex bg-screenBackgroundColor">
        <Sidebar navigationUrl={sidebarMenu} sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} handleDrawerClick={handleDrawerClick}/>
        <div className={`relative w-full`}>
          <Navbar handleDrawerClick={handleDrawerClick} logOutClick = {logOutFromTheApp}/>

          <div className="p-4 overflow-y-auto w-full">
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
      </div> */}

      <div className="w-full min-h-screen bg-screenBackgroundColor">
          <Sidebar navigationUrl={sidebarMenu} sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} handleDrawerClick={handleDrawerClick}/>
        <div className={`relative ${isSidebarOpen ? 'md:ml-64':'lg:ml-20'}`}>
          <Navbar handleDrawerClick={handleDrawerClick} logOutClick = {logOutFromTheApp}/>

          <div className="p-4 overflow-y-auto w-full">
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






