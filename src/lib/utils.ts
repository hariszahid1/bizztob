import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(n: number) {
  const value = new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(n || 0);
  return `Rs. ${value}`;
}

export function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function orderStatusStyle(status: string): string {
  switch (status) {
    case "PENDING":
      return "status-amber";
    case "CONFIRMED":
      return "status-blue";
    case "DISPATCHED":
      return "status-blue";
    case "DELIVERED":
      return "status-green";
    case "CANCELLED":
      return "status-red";
    default:
      return "status-slate";
  }
}

export function orderStatusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "In Review";
    case "CONFIRMED":
      return "Accepted";
    case "DISPATCHED":
      return "Dispatched";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Rejected";
    default:
      return status;
  }
}

export function makeOrderCode() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${y}${m}${d}-${rand}`;
}
