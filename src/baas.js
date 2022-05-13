'use strict';

import { getFirebaseConfig } from './firebase-config';
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import {
    addDoc,
    collection,
    getFirestore,
    serverTimestamp
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';


// Initialize Firebase
const config = getFirebaseConfig();
initializeApp(config);

const userPicElement = document.getElementById('user-pic');
const userNameElement = document.getElementById('user-name');

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
export function isUserSignedIn() {
   return !!getAuth().currentUser;
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
   return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
 } 

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
    console.log(user);
   if (user) { // User is signed in!
     // Get the signed-in user's profile pic and name.
     const profilePicUrl = getProfilePicUrl();
     const userName = getUserName();

     // Set the user's profile pic and name.
     userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
     userNameElement.textContent = userName;
 
     // Show user's profile and sign-out button.
     userNameElement.removeAttribute('hidden');
     userPicElement.removeAttribute('hidden');
     signOutBtn.removeAttribute('hidden');
 
     // Hide sign-in button.
     signInBtn.setAttribute('hidden', 'true');
 
   } else { // User is signed out!
     // Hide user's profile and sign-out button.
     userNameElement.setAttribute('hidden', 'true');
     userPicElement.setAttribute('hidden', 'true');
     signOutBtn.setAttribute('hidden', 'true');
 
     // Show sign-in button.
     signInBtn.removeAttribute('hidden');
   }
 }

 // Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
      return url + '?sz=150';
    }
    return url;
 }

 // Returns User ID
function getUserID() {
    return getAuth().currentUser.uid;
}

// Saves a book to Cloud Firestore
export async function saveBook(author, title, pages, read, id) {
    // Add a new book entry to firebase database by user id
    const uid = getUserID();
   try {
       await addDoc(collection(getFirestore(), uid), {
            name: getUserName(),
            bookId: id,
            bookAuthor: author,
            bookTitle: title,
            bookPages: pages,
            status: read,
            timestamp: serverTimestamp()
       });
     }
     catch(error) {
       console.error('Error writing new book to Firebase Database', error);
     }
}


// Firestore login elements
const signInBtn = document.getElementById('log-in');
signInBtn.addEventListener('click', signIn);

const signOutBtn = document.getElementById('log-out');
signOutBtn.addEventListener('click', signOutUser);

initFirebaseAuth();
