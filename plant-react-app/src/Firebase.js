import firebase from "firebase/app";
import "firebase/database";

var firebaseConfig = {
    apiKey: "AIzaSyBJ93splWbXIhDMcSMN8G4XGo6gk5b0Znk",
    authDomain: "plant-monitor-a630c.firebaseapp.com",
    databaseURL: "https://plant-monitor-a630c.firebaseio.com",
    projectId: "plant-monitor-a630c",
    storageBucket: "plant-monitor-a630c.appspot.com",
    messagingSenderId: "832899018186",
    appId: "1:832899018186:web:cadc93a824ef9ef0e7b333"
  };

firebase.initializeApp(firebaseConfig);
export default firebase;