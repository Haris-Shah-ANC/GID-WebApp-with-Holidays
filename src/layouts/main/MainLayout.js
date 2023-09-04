import React, { useContext, useEffect, useState, useRef } from "react";
import { routesName } from "../../config/routesName";
import Navbar from "../../components/custom/Navbar/Navbar";
import { mainRoutes } from "../../config/routes";
import * as Actions from '../../state/Actions'
import NotificationSound from '../../utils/notification.mp3'

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
import { fetchToken, onMessageListener } from "../../firebase";

function MainLayout() {

  const navigate = useNavigate();

  const ProtectedRoute = ({ children }) => {
    // if (false) {

    if (!isAuthenticated()) {
      return <Navigate to={"/auth" + routesName.login.path} replace={true} />;
    } else {
      return children;
    }
  };

  const [sidebarShow, setSidebarShow] = React.useState("-translate-x-full");
  const state = Actions.getState(useContext)
  const dispatch = Actions.getDispatch(useContext);
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [isTokenFound, setTokenFound] = useState(false);
  const audioPlayer = useRef(null);



  function playAudio() {
    audioPlayer.current.play();
  }
  onMessageListener().then(payload => {
    playAudio()
    setNotification({ title: payload.notification.title, body: JSON.parse(payload.notification.body).body })
    setShow(true);
    console.log("PAYLOAD", payload);
  }).catch(err => console.log('failed: ', err));

  const onShowNotificationClicked = () => {
    setNotification({ title: "Notification", body: "This is a test notification" })
    setShow(true);
  }
  useEffect(() => {
    dispatch(Actions.stateChange("workspace", getWorkspaceInfo()))
    notifyMe2()
  }, [])

  useEffect(() => {
  }, [dispatch.modalVisibility])

  if (!isTokenFound) {
    notifyMe()
  }
  const logOutFromTheApp = () => {
    clearCookie()
    navigate("/auth" + routesName.login.path)
  }

  function notifyMe() {
    console.log("PERMISSION")
    Notification.requestPermission().then((permission) => {

      if (permission === "granted") {
        fetchToken(setTokenFound);
      }
    });
  }
  const handleDrawerClick = () => {
    if (sidebarShow === "") {
      setSidebarShow("-translate-x-full");
    } else {
      setSidebarShow("");
    }
  };
  function notifyMe2() {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification("Hi there!");
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification("Hi there!");
          // …
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }
  return (
    <React.Fragment>
      <audio ref={audioPlayer} src={NotificationSound} />
      <div className="flex w-screen h-screen bg-screenBackgroundColor relative overflow-hidden">
        <SidebarContainer></SidebarContainer>
        <div className="w-full flex-1">
          <Navbar logOutClick={logOutFromTheApp}></Navbar>
          <div className="p-2 overflow-auto" style={{ height: '100%' }}>
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






