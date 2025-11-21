// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBxaifk9C5i1iJMgsMR7Tka84vBUh0U83M',
  authDomain: 'astro-authentication-8cb1a.firebaseapp.com',
  projectId: 'astro-authentication-8cb1a',
  storageBucket: 'astro-authentication-8cb1a.firebasestorage.app',
  messagingSenderId: '320491449414',
  appId: '1:320491449414:web:4d97b037f1abdccaf56e47',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

auth.languageCode = 'es';

export const firebase = {
  app,
  auth,
};
