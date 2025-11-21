<template>
  <div class="home-page">
    <NoteGrid :notes="notes" @edit="editNote" @delete="confirmDeleteNote" />
  </div>

  <UiModal v-if="showModal" :text="modalText" @close="closeModal">
    <UiButton
      v-for="btn in modalButtons"
      :variant="btn.variant"
      @click="btn.action()"
      >{{ btn.text }}</UiButton
    >
  </UiModal>
</template>

<script setup lang="ts">
const notesStore = useNotesStore();
const showModal = ref(false);
const modalText = ref();
const modalButtons = ref();

onMounted(() => {
  notesStore.loadFromStorage();
});

const notes = computed(() => notesStore.notes);

function editNote(id: string) {
  navigateTo(`/edit/${id}`);
}

function confirmDeleteNote(id: string) {
  showModal.value = true;

  modalText.value = "Вы уверены, что хотите удалить?";
  modalButtons.value = [
    {
      text: "Удалить",
      variant: "danger",
      action: () => {
        notesStore.deleteNote(id);
        closeModal();
      },
    },
    {
      text: "Отмена",
      variant: "default",
      action: () => {
        closeModal();
      },
    },
  ];
}

function closeModal() {
  showModal.value = false;

  modalText.value = "";
  modalButtons.value = [];
}
</script>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: var(--bg-primary);
  height: 100%;
  min-height: 0;
}
</style>
