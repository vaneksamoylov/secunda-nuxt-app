<template>
  <div class="home-page">
      <NoteGrid
        :notes="notes"
        @edit="editNote"
        @delete="confirmDeleteNote"
      />
  </div>
</template>

<script setup lang="ts">
const notesStore = useNotesStore()

onMounted(() => {
  notesStore.loadFromStorage()
})

const notes = computed(() => notesStore.notes)

function editNote(id: string) {
  navigateTo(`/edit/${id}`)
}

function confirmDeleteNote(id: string) {
  notesStore.deleteNote(id)
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