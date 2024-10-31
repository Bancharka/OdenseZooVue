// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';  
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC4kOoudggIlI-V_RexlRBCBGhBQjR23Vs",
  authDomain: "odensezooapp.firebaseapp.com",
  projectId: "odensezooapp",
  storageBucket: "odensezooapp.appspot.com",
  messagingSenderId: "45309177053",
  appId: "1:45309177053:web:9f20b3d16ed61d71093f34",
  databaseURL: "https://odensezooapp-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  
const database = getDatabase(app);

export { app, auth, database };
