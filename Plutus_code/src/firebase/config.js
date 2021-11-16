import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAs8CNbKjcyw2w6HVzLiFuLJA45IYeNhFI',
  authDomain: 'plutus2-84190.firebaseapp.com',
  databaseURL: 'https://your-database-name.firebaseio.com',
  projectId: 'plutus2-84190',
  storageBucket: 'plutus2-84190.appspot.com',
  messagingSenderId: '121490646881',
  appId: '1:121490646881:web:d559185c7fe48a2d2bc720',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {firebase};
