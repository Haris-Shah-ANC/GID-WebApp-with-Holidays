import React from 'react';
import { StateProvider } from './state/Store';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AuthLayout from './layouts/auth/AuthLayout';
import MainLayout from "./layouts/main/MainLayout";
import LandingLayout from "./layouts/landing/LandingLayout";
import './index.css'

import {
  Route,
  Routes,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
const App = () => {

  const NoMatchPage = () => {
    return <h3>404 - Not found</h3>;
  };

  return (
    <BrowserRouter>
      <StateProvider>
        {/* <CustomLoader /> */}
        <ToastContainer />
        <Routes>
          <Route path={"/auth/*"} element={<AuthLayout />} />
          <Route path={"/*"} element={<MainLayout />} />

          {/* <Route path={"/landing"} element={<LandingLayout />} /> */}

          {/* need to hide when landing page is there */}
          <Route path="/" element={<Navigate replace to="/auth/login" />} />
          <Route  path="/404" element={NoMatchPage}/>
          <Route from='*' element={<Navigate to="/404" />} />
        </Routes>
      </StateProvider>
    </BrowserRouter>
  )
}

export default App