importScripts('https://www.gstatic.com/firebasejs/5.4.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.4.1/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '355812679680'
});

const messaging = firebase.messaging();

// This step is only mentioned in this guide: https://firebase.google.com/docs/cloud-messaging/js/client
// Don't know if it's actually needed
// Add the public key generated from the console here.
// messaging.usePublicVapidKey("YOUR-VAPID-PUBLIC-KEY-HERE");
