import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore, addDoc, doc, collection, onSnapshot, getDoc, query, getDocs, orderBy, updateDoc } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import CRED from './cred.json'

const firebaseConfig = CRED;

export const FIREBASE_APP = initializeApp(firebaseConfig);

initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

export const initFirebase = (callback) => {
    onAuthStateChanged(FIREBASE_AUTH,
        nextOrObserver = user => {
            if (user) {
                callback(null, user);
            } else {
                signInAnonymously(FIREBASE_AUTH).catch(error => {
                    callback(error);
                });
            }
        }, error = err => {
            console.log("error", err)
        }
    )
}

let listSubscription;
export const getLists = (callback) => {
    const ref = getListsRef();

    const unsubscribe = onSnapshot(ref, (querySnapshot) => {
        const lists = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(lists);
    });

    listSubscription = unsubscribe;
}

export const getUserRef = () => {
    const userId = getUserId();
    const ref = doc(FIREBASE_DB, 'users', userId);
    return ref;
}

export const getListsRef = () => {
    const userRef = getUserRef();
    const ref = collection(userRef, 'lists');
    return ref;
}

export const detach = () => listSubscription && listSubscription();

export const getUserId = () => FIREBASE_AUTH.currentUser.uid;


export const addTodoList = async (list) => {
    const ref = getListsRef();
    await addDoc(ref, list);
}

export const updateTodo = async (list) => {
    const userRef = getUserRef();
    const listDocRef = doc(userRef, 'lists', list.id);

    await updateDoc(listDocRef, list);
}
