"use client";

import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile({ id: userDoc.id, ...userDoc.data() });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register a new user
  const register = async (email, password, displayName, school, course) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const newUser = userCredential.user;

      // Update Firebase Auth profile with display name
      await updateProfile(newUser, { displayName });

      // Create Firestore user document at users/{uid}
      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        displayName,
        email,
        school,
        course,
        createdAt: serverTimestamp(),
      });

      // Set local profile state
      setUserProfile({
        uid: newUser.uid,
        displayName,
        email,
        school,
        course,
      });

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already in use.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password must be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else {
        toast.error(error.message || "Registration failed.");
      }
      throw error;
    }
  };

  // Login an existing user
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        toast.error("Wrong password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please try again later.");
      } else {
        toast.error(error.message || "Login failed.");
      }
      throw error;
    }
  };

  // Logout the current user
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to log out.");
      throw error;
    }
  };

  return {
    user,
    loading,
    register,
    login,
    logout,
    userProfile,
  };
};
