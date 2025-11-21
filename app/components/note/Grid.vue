<template>
  <div class="notes-container">
    <NoteCard
      v-for="(note, index) in notes"
      :key="index"
      :note="note"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
    
    <div v-if="notes.length === 0" class="empty-state">
      <p>У вас пока нет заметок</p>
      <p class="empty-state__hint">Создайте первую заметку, нажав на кнопку выше</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  notes: Note[]
}

defineProps<Props>()
defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()
</script>

<style scoped lang="scss">
.notes-container {
  flex: 1;
  overflow-y: auto; 
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  align-content: start;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary-color);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  &__hint {
    font-size: 0.9rem;
    margin-top: 0.5rem;
    opacity: 0.7;
  }
}
</style>