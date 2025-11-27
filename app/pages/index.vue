<template>
  <div class="home-page">
    <NoteGrid :notes="notes" @edit="editNote" @delete="confirmDeleteNote" />
  </div>

  <UiModal v-if="showModal" :text="modalText" @close="closeModal">
    <UiButton
      v-for="(btn, index) in modalButtons"
      :key="index"
      :variant="btn.variant"
      @click="btn.action()"
      >{{ btn.text }}</UiButton
    >
  </UiModal>
</template>

<script setup lang="ts">
const notesStore = useNotesStore();
const { showModal, modalText, modalButtons, openModal, closeModal } =
  useModal();

onMounted(() => {
  notesStore.loadFromStorage();
});

const notes = computed(() => notesStore.notes);

function editNote(id: string) {
  navigateTo(`/edit/${id}`);
}

function confirmDeleteNote(id: string) {
  openModal("Вы уверены, что хотите удалить?", [
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
  ]);
}
</script>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: var(--background-color);
  height: 100%;
  min-height: 0;
}
</style>
