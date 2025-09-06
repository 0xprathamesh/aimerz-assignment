export const CATEGORIES = [
  "Work",
  "Health",
  "Finance",
  "Travel",
  "Personal",
  "Education",
  "Shopping",
  "Daily",
  "Other",
] as const;

export const PRIORITIES = ["low", "medium", "high"] as const;

export const STATUSES = ["pending", "completed"] as const;

// For badges/tags with light background
export const CATEGORY_COLORS = {
  Work: "bg-blue-100 text-blue-800 border-blue-200",
  Health: "bg-green-100 text-green-800 border-green-200",
  Finance: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Travel: "bg-purple-100 text-purple-800 border-purple-200",
  Personal: "bg-pink-100 text-pink-800 border-pink-200",
  Education: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Shopping: "bg-orange-100 text-orange-800 border-orange-200",
  Daily: "bg-cyan-100 text-cyan-800 border-cyan-200",
  Other: "bg-gray-100 text-gray-800 border-gray-200",
} as const;

// For dots/bars with solid colors
export const CATEGORY_DOT_COLORS = {
  Work: "bg-blue-500",
  Health: "bg-green-500",
  Finance: "bg-yellow-500",
  Travel: "bg-purple-500",
  Personal: "bg-pink-500",
  Education: "bg-indigo-500",
  Shopping: "bg-orange-500",
  Daily: "bg-cyan-500",
  Other: "bg-gray-500",
} as const;

// For badges/tags with light background
export const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800 border-gray-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
} as const;

// For dots with solid colors
export const PRIORITY_DOT_COLORS = {
  low: "bg-gray-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
} as const;

export const PRIORITY_ICONS = {
  low: "🔵",
  medium: "🟡",
  high: "🔴",
} as const;

export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Status = (typeof STATUSES)[number];
