import {
    getFirestore, collection, addDoc, query, where, orderBy, getDocs, updateDoc, deleteDoc, doc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"

const TODO_TITLE_COLLECTION = 'todo_titles';
const TODO_ITEM_COLLECTION = 'todo_items';

import { app } from "./firebase_core.js";
import { ToDoItem } from "../model/ToDoItem.js";
import { ToDoTitle } from "../model/ToDoTitle.js";

const db = getFirestore(app);

// add a new todo title to the firestore
export async function addToDoTitle(todoTitle) {
    const docRef = await addDoc(collection(db, TODO_TITLE_COLLECTION), todoTitle.toFirestore());
    return docRef.id;
}

// add a new todo item to the firestore
export async function addToDoItem(todoItem) {
    const docRef = await addDoc(collection(db, TODO_ITEM_COLLECTION), todoItem.toFirestore());
    return docRef.id;
}

// get a list of todo items from the firestore
export async function getToDoItemList(titleDocId, uid) {
    let itemList = [];
    const q = query(collection(db, TODO_ITEM_COLLECTION),
        where('uid', '==', uid),
        where('titleId', '==', titleDocId),
        orderBy('timestamp'),
    );
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const item = new ToDoItem(doc.data(), doc.id);
        itemList.push(item);
    });
    return itemList;
}

// get a list of todo titles from the firestore
export async function getToDoTitleList(uid) {
    let titleList = [];
    const q = query(collection(db, TODO_TITLE_COLLECTION),
        where('uid', '==', uid),
        orderBy('timestamp', 'desc'));
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const t = new ToDoTitle(doc.data(), doc.id);
        titleList.push(t);
    });
    return titleList;
}

// update a todo item in the firestore
export async function updateToDoItem(docId, update) {
    const docRef = doc(db, TODO_ITEM_COLLECTION, docId);
    await updateDoc(docRef, update);
}

// delete a todo item from the firestore
export async function deleteToDoItem(itemId) {
    const docRef = doc(db, TODO_ITEM_COLLECTION, itemId);
    await deleteDoc(docRef);
}