"use client";

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from "@/utils/fileHelpers";
import { useUploadThing } from "@/utils/uploadthing";

/**
 * useFiles — manages file uploads within a specific subject.
 * Uses Uploadthing for file hosting, Firestore for metadata.
 * Subcollection path: subjects/{subjectId}/files/{fileId}
 *
 * @param {string} subjectId
 * @param {string} userId
 * @param {string} [uploaderName] — display name for denormalized uploaderName field
 */
export const useFiles = (subjectId, userId, uploaderName) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { startUpload, isUploading } = useUploadThing("subjectFileUploader", {
    onUploadError: (error) => {
      console.error("Uploadthing error:", error);
      toast.error(error?.message || "File upload failed. Please try again.");
    },
  });

  // Real-time listener for files ordered by createdAt descending
  useEffect(() => {
    if (!subjectId) {
      setFiles([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "subjects", subjectId, "files"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fileList = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setFiles(fileList);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to files:", error);
        toast.error("Failed to load files.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [subjectId]);

  /**
   * Upload a file via Uploadthing and save the Firestore document.
   * Validates file type and size before uploading.
   */
  const uploadFile = async (file) => {
    if (!subjectId || !userId) {
      toast.error("You must be logged in to upload files.");
      return;
    }

    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error(
        "Unsupported file type. Please upload PDF, DOCX, XLSX, PPTX, PNG, JPG, or ZIP.",
      );
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File is too large. Maximum allowed size is 16 MB.");
      return;
    }

    try {
      const res = await startUpload([file]);

      if (!res || res.length === 0) {
        toast.error("Upload failed. No response received.");
        return;
      }

      const uploaded = res[0];
      const fileId = uuidv4();

      // Save Firestore document with file metadata
      const fileRef = doc(db, "subjects", subjectId, "files", fileId);
      await setDoc(fileRef, {
        id: fileId,
        name: uploaded.name,
        downloadURL: uploaded.url,
        fileType: file.type,
        fileSize: file.size,
        uploaderId: userId,
        uploaderName: uploaderName || "Unknown",
        subjectId,
        createdAt: serverTimestamp(),
      });

      toast.success(`"${uploaded.name}" uploaded successfully.`);
    } catch (error) {
      console.error("Upload error:", error);
      // Error toast may already be shown by onUploadError callback
      if (!error?.message?.includes("upload")) {
        toast.error("File upload failed. Please try again.");
      }
    }
  };

  /**
   * Delete a file's Firestore document.
   * Uploadthing free tier does not support programmatic deletion.
   */
  const deleteFile = async (fileId) => {
    if (!subjectId) return;

    try {
      const fileRef = doc(db, "subjects", subjectId, "files", fileId);
      await deleteDoc(fileRef);
      toast.success("File deleted.");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file. Please try again.");
    }
  };

  return { files, loading, uploadFile, deleteFile, isUploading };
};
