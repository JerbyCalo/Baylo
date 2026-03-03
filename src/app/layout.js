import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "StudyHub — Student Notes & File Sharing",
  description:
    "A student-focused notes and file sharing platform. Organize notes by subject, share files with classmates, and collaborate easily.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "0.75rem",
              background: "#fff",
              color: "#171717",
              fontSize: "0.875rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#6366f1",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
