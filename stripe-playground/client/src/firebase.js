import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyBzo-OdZkKXUx5Ns_TgzgiZvpDUVMKMkjs',
  authDomain: 'food-22d6b.firebaseapp.com',
  databaseURL: 'https://food-22d6b.firebaseio.com',
  projectId: 'food-22d6b',
  storageBucket: 'food-22d6b.appspot.com',
  messagingSenderId: '400378343507',
  appId: '1:400378343507:web:b377ecc970c290578816a6',
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
