import { getFirebaseConfig } from './firebase-config';
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
initializeApp(getFirebaseConfig());

// Signs-in to Library
async function signIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
}

// Signs-out of Library.
function signOutUser() {
    // Sign out of Firebase.
    signOut(getAuth());
}

// Initialize firebase auth
function initFirebaseAuth() {
   // Listen to auth state changes.
   onAuthStateChanged(getAuth(), authStateObserver);
}

// Returns the signed-in user's display name.
function getUserName() {
   return getAuth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
   return !!getAuth().currentUser;
}

 // Triggers when the auth state change for instance when the user signs-in or signs-out.
 function authStateObserver(user) {
    if (user) { // User is signed in!
      // Get the signed-in user's profile pic and name.
      var profilePicUrl = getProfilePicUrl();
      var userName = getUserName();
  
      // Set the user's profile pic and name.
      userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
      userNameElement.textContent = userName;
  
      // Show user's profile and sign-out button.
      userNameElement.removeAttribute('hidden');
      userPicElement.removeAttribute('hidden');
      signOutBtn.removeAttribute('hidden');
  
      // Hide sign-in button.
      signInBtn.setAttribute('hidden', 'true');
  
      // We save the Firebase Messaging Device token and enable notifications.
      saveMessagingDeviceToken();
    } else { // User is signed out!
      // Hide user's profile and sign-out button.
      userNameElement.setAttribute('hidden', 'true');
      userPicElement.setAttribute('hidden', 'true');
      signOutBtn.setAttribute('hidden', 'true');
  
      // Show sign-in button.
      signInBtn.removeAttribute('hidden');
    }
  }

const userPicElement = document.getElementById('user-pic');
const userNameElement = document.getElementById('user-name');

// Firestore login elements
const signInBtn = document.getElementById('log-in');
signInBtn.addEventListener('click', signIn);

const signOutBtn = document.getElementById('log-out');
signOutBtn.addEventListener('click', signOutUser);

initFirebaseAuth();
