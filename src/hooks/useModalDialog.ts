import { create } from "zustand";

interface ModalDialogStore {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  showModal: (params: ShowModalParams) => void;
  closeModal: () => void;
}

interface ShowModalParams {
  title: string;
  content: React.ReactNode;
}

export const useModalDialog = create<ModalDialogStore>((set) => ({
  isOpen: false,
  title: "",
  content: null,
  isLoading: false,
  showModal: (params) => set({ isOpen: true, ...params }),
  closeModal: () => set({ isOpen: false }),
}));
