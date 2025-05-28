import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDTmhT3pn5sfe35L4s2JVK-hu5agPF25k8",
    authDomain: "eutreino-d5c05.firebaseapp.com",
    projectId: "eutreino-d5c05",
    storageBucket: "eutreino-d5c05.firebasestorage.app",
    messagingSenderId: "592063814314",
    appId: "1:592063814314:web:691f5e34a50e178b374ed3",
    measurementId: "G-RCFK2VX69S"
  };

const app = initializeApp(firebaseConfig);

export default app;