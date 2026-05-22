import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKVsU3MhDCd-c2-2zYVOf1prqWS9RL8yI",
  authDomain: "choosemylab-auth.firebaseapp.com",
  projectId: "choosemylab-auth",
  storageBucket: "choosemylab-auth.firebasestorage.app",
  messagingSenderId: "185235908088",
  appId: "1:185235908088:web:989d4d0904876d3362a20d",
  measurementId: "G-5LMSK0FLW4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable standard multi-language capability
auth.useDeviceLanguage();

export { RecaptchaVerifier, signInWithPhoneNumber };
