"use client";

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

/**
 * useNotes — manages notes within a specific subject.
 * Subcollection path: subjects/{subjectId}/notes/{noteId}
 *
 * @param {string} subjectId
 * @param {string} userId
 * @param {string} [authorName] — display name for denormalized authorName field
 */
export const useNotes = (subjectId, userId, authorName) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for notes ordered by createdAt descending
  useEffect(() => {
    if (!subjectId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "subjects", subjectId, "notes"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const noteList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(noteList);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to notes:", error);
        toast.error("Failed to load notes.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [subjectId]);

  /**
   * Add a new note.
   * @param {string} title
   * @param {string} content — Tiptap HTML string
   * @returns {Promise<string>} — the new note ID
   */
  const addNote = async (title, content) => {
    try {
      const noteId = uuidv4();

      await setDoc(doc(db, "subjects", subjectId, "notes", noteId), {
        id: noteId,
        title,
        content,
        authorId: userId,
        authorName: authorName || "Unknown",
        subjectId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Note created!");
      return noteId;
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to create note.");
      throw error;
    }
  };

  /**
   * Update an existing note.
   * @param {string} noteId
   * @param {{ title?: string, content?: string }} updates
   */
  const updateNote = async (noteId, updates) => {
    try {
      await setDoc(
        doc(db, "subjects", subjectId, "notes", noteId),
        {
          ...updates,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      toast.success("Note saved!");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to save note.");
      throw error;
    }
  };

  /**
   * Delete a note.
   * @param {string} noteId
   */
  const deleteNote = async (noteId) => {
    try {
      await deleteDoc(doc(db, "subjects", subjectId, "notes", noteId));
      toast.success("Note deleted.");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note.");
      throw error;
    }
  };

  /**
   * Fetch a single note by ID.
   * @param {string} noteId
   * @returns {Promise<object|null>}
   */
  const getNote = async (noteId) => {
    try {
      const noteDoc = await getDoc(
        doc(db, "subjects", subjectId, "notes", noteId),
      );
      if (noteDoc.exists()) {
        return { id: noteDoc.id, ...noteDoc.data() };
      }
      toast.error("Note not found.");
      return null;
    } catch (error) {
      console.error("Error fetching note:", error);
      toast.error("Failed to load note.");
      throw error;
    }
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    getNote,
  };
};
