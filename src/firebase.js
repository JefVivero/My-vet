import firebase from 'firebase/app'
import 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyD_APzTjndJMsYjeaVGBvPadT2TezidT5Y",
    authDomain: "myvet-d39f7.firebaseapp.com",
    projectId: "myvet-d39f7",
    storageBucket: "myvet-d39f7.appspot.com",
    messagingSenderId: "618212800411",
    appId: "1:618212800411:web:9bcb10d7a52283ffaed33e"
  }

  export const firebaseApp = firebase.initializeApp(firebaseConfig)