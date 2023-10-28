import { create } from 'zustand';

export type ModalType = "editProfile" | "settings"

interface ModalStore{
    isOpen: boolean;
    type: ModalType | null
    onOpen: (type: ModalType) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    isOpen: false,
    type: null,
    onOpen: (type) => {set({type, isOpen: true}), console.log(type)},
    onClose: () => set({type: null, isOpen: false})
}));