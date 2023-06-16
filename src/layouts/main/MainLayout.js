import React from "react";
import { imagesList } from "../../utils/Constant";
import { routesName } from "../../config/routesName";
import Navbar from "../../components/custom/Navbar/Navbar";
import Drawer from "../../components/custom/Drawer/Drawer";
import { mainRoutes, sidebarMenu } from "../../config/routes";
import Sidebar from "../../components/custom/Sidebar/Sidebar";

import {
  getToken,
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

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleDrawerClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  return (
    <React.Fragment>
      <div className="bg-screenBackgroundColor flex h-screen w-full fixed">
        <div className='overflow-y-auto overflow-x-hidden min-h-screen hidden sm:block md:block lg:block xl:block'>
          <Sidebar navigationUrl={sidebarMenu} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
        </div>
        {isDrawerOpen && (<Drawer navigationUrl={sidebarMenu} isDrawerOpen={isDrawerOpen} handleDrawerClick={handleDrawerClick} />)}
        <div className="flex-grow">
          <Navbar handleDrawerClick={handleDrawerClick} />

          <div className="p-4 overflow-y-auto w-full" style={{ height: 'calc(100vh - 80px)', maxWidth: isSidebarOpen ? 'calc(100vw - 240px)' : 'calc(100vw - 56px)'}}>
          {/* <div className={`p-4 overflow-y-auto w-full sm:max-w-none md:${isSidebarOpen ?'max-w-[calc(100vw-240px)]':'max-w-[calc(100vw-56px)]'}`} style={{height: 'calc(100vh - 80px)'}}> */}
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






