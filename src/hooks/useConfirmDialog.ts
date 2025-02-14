import { create } from "zustand";

interface ConfirmDialogStore {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showDialog: (params: ShowDialogParams) => void;
  closeDialog: () => void;
}

interface ShowDialogParams {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const useConfirmDialog = create<ConfirmDialogStore>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  onConfirm: undefined,
  onCancel: undefined,
  showDialog: (params) => set({ isOpen: true, ...params }),
  closeDialog: () => set({ isOpen: false }),
}));
