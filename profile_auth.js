import {initializeApp} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";

const firebaseConfig = {
apiKey: "AIzaSyBP6V-JqoDsq36lgSJDzA-L8x-Sf6Q80Ew",
authDomain: "mathematical-unity-f4f26.firebaseapp.com",
projectId: "mathematical-unity-f4f26",
storageBucket: "mathematical-unity-f4f26.firebasestorage.app",
messagingSenderId: "467536962995",
appId: "1:467536962995:web:ea38df6236351b5bec57c6",
measurementId: "G-3NJVLW4C5X"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.languageCode = 'en';
document.addEventListener("DOMContentLoaded", function () {
  const googleLogin = document.getElementById("google-login-btn");
  if (googleLogin) {
    googleLogin.addEventListener("click", function () {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const user = result.user;
          console.log("User signed in:", user);
          window.location.href = "profile.html";
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    });
  } else {
    console.error("Element with ID 'google-login-btn' not found.");
  }
});