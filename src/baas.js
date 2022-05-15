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
    serverTimestamp,
    doc,
    deleteDoc,
    getDocs,
    setDoc,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { Book, displayBooks, emptyMyLibrary, myLibrary } from './index';


// Initialize Firebase
const config = getFirebaseConfig();
const app = initializeApp(config);

const db = getFirestore(app);

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

     // load user books
     loadBooks();
 
   } else { // User is signed out!
     // Hide user's profile and sign-out button.
     userNameElement.setAttribute('hidden', 'true');
     userPicElement.setAttribute('hidden', 'true');
     signOutBtn.setAttribute('hidden', 'true');
 
     // Show sign-in button.
     signInBtn.removeAttribute('hidden');

     // empty myLibrary array & displayd books
     emptyMyLibrary();
     displayBooks();
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
export async function saveBook(author, title, pages, read) {
    // Add a new book entry to firebase database by user id
    const uid = getUserID();
   try {
       await addDoc(collection(db, uid), {
            name: getUserName(),
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
     // load newly added book
     loadBooks();
}

// Load user stored books from firestore
export async function loadBooks() {
    const uid = getUserID();
    //emptyMyLibrary(); // clear myLibrary array to avoid duplicates
    const querySnapshot = await getDocs(collection(db, uid));
    querySnapshot.forEach((book) => {
        // if book is displayed => return
        if (myLibrary.some(e => e.id === book._document.key.path.segments[6])) {
        // if not displayed, create a new Book => add to myLibrary array
        } else {
            new Book(book._document.data.value.mapValue.fields.bookAuthor.stringValue,
                book._document.data.value.mapValue.fields.bookTitle.stringValue,
                book._document.data.value.mapValue.fields.bookPages.stringValue,
                book._document.data.value.mapValue.fields.status.stringValue,
                book._document.key.path.segments[6]);
        }
    })
    // displays user books on the page
    displayBooks();
}

// delete Book from firestore
export async function deleteBookFromDb(id) {
    const uid = getUserID();
    try {
        await deleteDoc(doc(db, uid, id));
        console.log("Book " + id + " succesfully deleted from library");

    } catch (error) {
        console.error('Error while deleting document:', error);
    }
    displayBooks();
};

// change book's status on firestore db
export async function changeStatusDb(id, value) {
    const uid = getUserID();
    try {
        const ref = doc(db, uid, id);
        await setDoc(ref, { status: value }, { merge: true });
        console.log("Book " + id + " status changed");

    } catch (error) {
        console.error('Error while changing status in document:', error);
        return;
    }
    displayBooks();
}

// Firestore login elements
const signInBtn = document.getElementById('log-in');
signInBtn.addEventListener('click', signIn);

const signOutBtn = document.getElementById('log-out');
signOutBtn.addEventListener('click', signOutUser);

initFirebaseAuth();
