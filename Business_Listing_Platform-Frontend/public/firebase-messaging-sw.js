importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// WARNING: In Vite, service workers in `public` do not automatically get `import.meta.env` replaced.
// You must hardcode these values OR use a plugin like vite-plugin-pwa to inject them.
firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'System Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message.',
    icon: '/logo.png', // Fallback icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
