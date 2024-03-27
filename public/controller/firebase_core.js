// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVZUpVtRZp541zZslpWlTzjsurbVeC8wc",
  authDomain: "ynagella-cmsc5373-webapp.firebaseapp.com",
  projectId: "ynagella-cmsc5373-webapp",
  storageBucket: "ynagella-cmsc5373-webapp.appspot.com",
  messagingSenderId: "1034233104503",
  appId: "1:1034233104503:web:05012238e256dedcca1e72",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
