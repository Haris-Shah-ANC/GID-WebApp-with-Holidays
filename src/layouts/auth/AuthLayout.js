import React from "react";
import { authRoutes } from "../../config/routes";
import { routesName } from "../../config/routesName";
import { isAuthenticated } from "../../config/cookiesInfo";

import {
  getQueryParams,
} from "../../utils/Utils";

import {
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

export default function AuthLayout() {
  console.log('AuthLayout=>', authRoutes)

  const location = useLocation();
  const params = getQueryParams(location.search);

  const ProtectedRoute = ({ children }) => {
    // if (true) {
      if (!params.token && isAuthenticated()) {
      return <Navigate to={routesName.dashboard.path} replace />;
    } else {
      return children;
    }
  };

  return (
    <main>
      <section className="relative w-full h-full py-40 min-h-screen">
        <div
          className="absolute top-0 w-full h-full bg-blue-900 bg-no-repeat bg-full"
          style={{}}
        ></div>
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-5/12 px-4">
              <Routes>
                {
                  authRoutes.map((route, index) =>
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
      </section>
    </main>

  );
}


