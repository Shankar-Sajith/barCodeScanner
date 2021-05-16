import  firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyBCpQca4iOXxbcbT3Fmkhh4SLjFUf8ROwQ",
    authDomain: "wi-ly-app-9aae1.firebaseapp.com",
    projectId: "wi-ly-app-9aae1",
    storageBucket: "wi-ly-app-9aae1.appspot.com",
    messagingSenderId: "278287495210",
    appId: "1:278287495210:web:6378fcf60008514049d353"
  };
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
  }
  export default firebase.firestore();