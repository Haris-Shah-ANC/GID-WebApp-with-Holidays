
// // Scripts for firebase and firebase messaging
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//     apiKey: "AIzaSyAjWIJe9AaL6fDZVn9tRajF-BUexEPFZyA",
//     authDomain: "react-notif-40228.firebaseapp.com",
//     projectId: "react-notif-40228",
//     storageBucket: "react-notif-40228.appspot.com",
//     messagingSenderId: "790644971731",
//     appId: "1:790644971731:web:dc0c5d007d2b961af3dc26"
// };

// firebase.initializeApp(firebaseConfig);
// // console.log("NAVIGATION",navigate())
// // Retrieve firebase messaging
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//     console.log('Received background message ', payload);

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = payload.notification.body;
//     const options = {
//         body: 'How are you doing? )',
//         icon: 'public/logo192.png',
//         badge: 'public/logo192.png',
//         actions: [
//             {
//                 action: 'reply',
//                 type: 'text',
//                 title: 'Reply',
//                 icon: 'public/logo192.png',
//             }
//         ],
//     };
//     self.registration.showNotification(notificationTitle, JSON.parse(notificationOptions));

//     self.addEventListener('notificationclick', (event) => {
//         const reply = event.reply;
//         if (event.action === "reply") {
//         }
//         console.log("USER REPLY", event)
//         // Do something with the user's reply
//         // const promiseChain = doSomething(reply);
//         // event.waitUntil(promiseChain);
//     });

//     self.onnotificationclick = (event) => {
//         console.log("On notification click: ", event);
//         event.notification.close();

//         // This looks to see if the current is already open and
//         // focuses if it is
//         event.waitUntil(
//             clients
//                 .matchAll({
//                     includeUncontrolled: true,
//                     type: "window",
//                 })
//                 .then((clientList) => {
//                     // console.log("CLIENT LIST", clientList)
//                     if (clientList.length) {
//                         clientList[0].focus();
//                     }else{
//                         clients.openWindow("/")
//                     }
//                     // for (const client of clientList) {
//                     //     if (client.url === "/" && "focus" in client) return client.focus();
//                     // }
//                     // if (clients.openWindow) return clients.openWindow("/");
//                 }),
//         );
//     };
// });