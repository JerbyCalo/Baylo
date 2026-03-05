"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

/**
 * useMembers — fetches the member profiles for a subject.
 *
 * Reads the subject document to get memberIds, then batch-fetches
 * each user profile from users/{uid}.
 *
 * @param {string} subjectId
 * @returns {{ members: Array, loading: boolean }}
 */
export function useMembers(subjectId) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchMembers = async () => {
      setLoading(true);
      try {
        const subjectSnap = await getDoc(doc(db, "subjects", subjectId));
        if (!subjectSnap.exists()) {
          if (!cancelled) {
            setMembers([]);
            setLoading(false);
          }
          return;
        }

        const memberIds = subjectSnap.data().memberIds || [];

        const profileSnaps = await Promise.all(
          memberIds.map((uid) => getDoc(doc(db, "users", uid))),
        );

        const profiles = profileSnaps
          .filter((snap) => snap.exists())
          .map((snap) => ({
            uid: snap.id,
            displayName: snap.data().displayName || "Unknown",
            school: snap.data().school || "",
            course: snap.data().course || "",
          }));

        if (!cancelled) {
          setMembers(profiles);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to load members.");
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMembers();

    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  return { members, loading };
}
