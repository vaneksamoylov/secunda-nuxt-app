export interface ModalButton {
  text: string;
  action: () => void;
  variant?: ButtonVariant;
}

/**
 * Composable для управления модальными окнами
 */
export const useModal = () => {
  const showModal = ref(false);
  const modalText = ref("");
  const modalButtons = ref<ModalButton[]>([]);

  const openModal = (text: string, buttons: ModalButton[]) => {
    modalText.value = text;
    modalButtons.value = buttons;
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    modalText.value = "";
    modalButtons.value = [];
  };

  return {
    showModal,
    modalText,
    modalButtons,
    openModal,
    closeModal,
  };
};
