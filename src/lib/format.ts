const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const numberFormatter = new Intl.NumberFormat("vi-VN");

const dateFormatter = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" });

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatPrice(amount: number): string {
  return vndFormatter.format(amount);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatDate(value: Date | string | number): string {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: Date | string | number): string {
  return dateTimeFormatter.format(new Date(value));
}
