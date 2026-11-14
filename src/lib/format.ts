import { format } from "date-fns";

export function formatDate(value: Date | number | string, pattern = "dd/MM/yyyy") {
  return format(new Date(value), pattern);
}

export function formatDateTime(value: Date | number | string, pattern = "dd/MM/yyyy HH:mm") {
  return format(new Date(value), pattern);
}

export function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "??";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
