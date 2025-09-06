import { format } from "date-fns";

export const formatTodoDate = (dateString: string) => {
  const date = new Date(dateString);
  // Convert UTC date to local date for display
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate;
};

export const formatTodoDateRange = (startDate: string, endDate: string) => {
  const start = formatTodoDate(startDate);
  const end = formatTodoDate(endDate);

  if (start.toDateString() === end.toDateString()) {
    return format(start, "MMM dd, yyyy");
  }

  return `${format(start, "MMM dd")} - ${format(end, "MMM dd, yyyy")}`;
};
