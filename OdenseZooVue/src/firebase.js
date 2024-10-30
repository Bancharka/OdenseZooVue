// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';  
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4kOoudggIlI-V_RexlRBCBGhBQjR23Vs",
  authDomain: "odensezooapp.firebaseapp.com",
  projectId: "odensezooapp",
  storageBucket: "odensezooapp.appspot.com",
  messagingSenderId: "45309177053",
  appId: "1:45309177053:web:9f20b3d16ed61d71093f34",
  databaseURL: "https://odensezooapp-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  
const database = getDatabase(app);

export { database };