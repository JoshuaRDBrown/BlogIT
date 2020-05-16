import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDbGxc8ECEKpAkey5JV7qphqgzN-KglqrQ",
    authDomain: "blog-project-66ded.firebaseapp.com",
    databaseURL: "https://blog-project-66ded.firebaseio.com",
    projectId: "blog-project-66ded",
    storageBucket: "blog-project-66ded.appspot.com",
    messagingSenderId: "50508703437",
    appId: "1:50508703437:web:30213d4906bd69c88fab84",
    measurementId: "G-8GHGJM5D8P"
};

const fb = firebase.initializeApp(firebaseConfig);

export default fb;