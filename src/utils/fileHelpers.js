export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

export const getFileIcon = (mimeType) => {
  if (mimeType === "application/pdf") return "FileText";
  if (mimeType.includes("image")) return "Image";
  if (mimeType.includes("word")) return "FileType";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return "Table";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return "Presentation";
  if (mimeType.includes("zip")) return "Archive";
  return "File";
};

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
  "application/zip",
];

export const MAX_FILE_SIZE_BYTES = 16 * 1024 * 1024; // 16MB (Uploadthing free tier)
