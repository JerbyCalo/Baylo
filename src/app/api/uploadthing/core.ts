import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  subjectFileUploader: f({
    blob: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      // Firebase Auth is client-side — auth is enforced by useRequireAuth()
      // before any upload is triggered. This middleware runs server-side.
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
