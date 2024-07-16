import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBN10kfciNv3PiVrYOrHCDhSNE51yuiLfM",
  authDomain: "stock-tracker-c0d49.firebaseapp.com",
  projectId: "stock-tracker-c0d49",
  storageBucket: "stock-tracker-c0d49.appspot.com",
  messagingSenderId: "483757727306",
  appId: "1:483757727306:web:e888fb386d375fb197d0b3",
  measurementId: "G-K2DSTVNC2P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);
export { auth };
