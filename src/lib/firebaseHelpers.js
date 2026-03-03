import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const getDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getDocuments = async (collectionName, constraints = []) => {
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, { ...data, createdAt: serverTimestamp() });
  return docId;
};

export const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
};

export const deleteDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

export { serverTimestamp };
