import { format, formatDistanceToNow } from "date-fns";

export const formatDisplayDate = (timestamp) => {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, "MMM d, yyyy");
};

export const formatRelativeDate = (timestamp) => {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
};
