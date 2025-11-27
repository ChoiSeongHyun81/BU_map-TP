import { create } from "zustand";

type Toast = {
  id: string;
  message: string;
  type?: "info" | "success" | "error";
};

type UiState = {
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  pushToast: (toast) => {
    const id = crypto.randomUUID?.() ?? String(Date.now());
    set({ toasts: [...get().toasts, { id, ...toast }] });
  },
  removeToast: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
