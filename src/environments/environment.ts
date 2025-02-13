import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAAdFNzmOg9Ojx-rgW2kFfaS7a3QvjaTrk",
    authDomain: "grupoexito-7863f.firebaseapp.com",
    projectId: "grupoexito-7863f",
    storageBucket: "grupoexito-7863f.appspot.com",
    messagingSenderId: "419439474714",
    appId: "1:419439474714:web:fb851c772025ddb06ef9a3"
};

const app = initializeApp(firebaseConfig);

export const environment = {
    app,
    production: false,
    firebaseConfig
};
