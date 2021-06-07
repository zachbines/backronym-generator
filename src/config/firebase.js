import firebase from "firebase/app";
import "firebase/database";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBXDIkj36roG-uxleSbpiR_Mp19yWEom6c",
    authDomain: "backronym-generator-1cf6a.firebaseapp.com",
    databaseURL: "https://backronym-generator-1cf6a-default-rtdb.firebaseio.com",
    projectId: "backronym-generator-1cf6a",
    storageBucket: "backronym-generator-1cf6a.appspot.com",
    messagingSenderId: "830235857547",
    appId: "1:830235857547:web:7fef09863fc99e1f193a8e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;