import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDZAQY7zX6sKqKF6Hi2wfBnBsTPQK4g1I0",
  authDomain: "mobilestar-fa241.firebaseapp.com",
  projectId: "mobilestar-fa241",
  storageBucket: "mobilestar-fa241.firebasestorage.app",
  messagingSenderId: "1009509401652",
  appId: "1:1009509401652:web:583a91b74214259b32b661",
  measurementId: "G-EX99FKD2S7"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };