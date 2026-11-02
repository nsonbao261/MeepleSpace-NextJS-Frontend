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
