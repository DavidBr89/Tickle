importScripts("https://www.gstatic.com/firebasejs/4.12.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.12.0/firebase-messaging.js");

firebase.initializeApp({
    messagingSenderId: "655124348640"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
    const title = payload.notification.title;
    console.log('payload', payload.notification.icon);
    const options = {
        body: payload.notification.body,
        icon: payload.notification.icon
    }
    return self.registration.showNotification(title, options);
})

self.addEventListener('install', function(event) {
    console.log('SW INSTALLED');


});

self.addEventListener('fetch', function(event) {
    console.log('SW FETCHED');

    
});