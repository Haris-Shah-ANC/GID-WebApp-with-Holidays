// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// const firebaseConfig = {
//     apiKey: "AIzaSyCnVtDGbBnlhzFKkqTvb91dXCkIhrStdxI",
//     authDomain: "notify-d838e.firebaseapp.com",
//     projectId: "notify-d838e",
//     storageBucket: "notify-d838e.appspot.com",
//     messagingSenderId: "280383009555",
//     appId: "1:280383009555:web:8885165c6ea64c004920e6",
//     measurementId: "G-WG2VM322M2"
// };


// const firebaseApp = initializeApp(firebaseConfig);
// const messaging = getMessaging(firebaseApp);

// export const fetchToken = (setTokenFound) => {
//     return getToken(messaging, {
//         vapidKey: 'BI7QV0Uw1ebTjhqCHhqf7ptEfLSygzkLM7fNX74D0QBKKZVvV5-BWW7IFcl8s5rsHckmAOEsT6FQakvZbO7aSv4'
//     }).then((currentToken) => {
//         if (currentToken) {
//             console.log('current token for client: ', currentToken);
//             setTokenFound(true);
//             // Track the token -> client mapping, by sending to backend server
//             // show on the UI that permission is secured
//         } else {
//             console.log('No registration token available. Request permission to generate one.');
//             setTokenFound(false);
//             // shows on the UI that permission is required 
//         }
//     }).catch((err) => {
//         console.log('An error occurred while retrieving token. ', err);
//         // catch error while creating client token
//     });
// }

// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         onMessage(messaging, (payload) => {
//             resolve(payload);
//         });
//     });