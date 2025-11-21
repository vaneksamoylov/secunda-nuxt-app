<template>
  <div class="home-page">
      <NoteGrid
        :notes="notes"
        @edit="editNote"
        @delete="confirmDeleteNote"
      />
  </div>

  <UiModal v-if="showModal" :text="modalText" @close="showModal = false">
    <UiButton v-for="btn in modalButtons" @click="btn.action()">{{
      btn.text
    }}</UiButton>
  </UiModal>
</template>

<script setup lang="ts">
const notesStore = useNotesStore()
const showModal = ref(false)
const modalText = ref('Вы уверены, что хотите удалить?')
const modalButtons = ref()

onMounted(() => {
  notesStore.loadFromStorage()
})

const notes = computed(() => notesStore.notes)

function editNote(id: string) {
  navigateTo(`/edit/${id}`)
}

function confirmDeleteNote(id: string) {
  showModal.value = true

  modalButtons.value = [
    {
        text: 'Удалить',
        action: () => {
          notesStore.deleteNote(id)
          showModal.value = false
        },
      },
      {
        text: 'Отмена',
        action: () => {
          showModal.value = false
        },
      },
  ]
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