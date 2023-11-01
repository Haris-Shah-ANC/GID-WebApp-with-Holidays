import React from "react";
import { landingRoutes } from "../../config/routes";
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

export default function LandingLayout() {
  const location = useLocation();
  const params = getQueryParams(location.search);

  const ProtectedRoute = ({ children }) => {
    if (isAuthenticated()) {
      return <Navigate to={routesName.dashboard.path} replace />;
    } else {
      return children;
    }
  };

  return (
    <Routes>
      {
        landingRoutes.map((route, index) =>
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
      {/* <Route path="/404" element={<PageNotFound />} /> */}
    </Routes>
  );
}

function PageNotFound() {
  return (
    <div>
      <p>404 Page not found</p>
    </div>
  );
}
