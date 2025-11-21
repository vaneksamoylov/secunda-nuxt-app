<template>
  <div class="note-card" @click="handleClick">
    <div class="note-card__header">
      <h3 class="note-card__title">{{ note.title }}</h3>
      <div class="note-card__actions">
        <UiButton variant="default" size="sm" @click.stop="editNote">
          ✏️
        </UiButton>
        <UiButton variant="danger" size="sm" @click.stop="confirmDelete">
          🗑️
        </UiButton>
      </div>
    </div>
    
    <div class="note-card__todos">
      <div
        v-for="todo in visibleTodos"
        :key="todo.id"
        class="todo-preview"
        :class="{ 'todo-preview--done': todo.done }"
      >
        <input
          type="checkbox"
          :checked="todo.done"
          disabled
          class="todo-preview__checkbox"
        >
        <span class="todo-preview__text">{{ todo.text }}</span>
      </div>
      
      <div v-if="hasMoreTodos" class="note-card__more">
        + еще {{ note.todos.length - 3 }} задач
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  note: Note
}

// TODO: Заменить на Note
const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
  click: [id: string]
}>()

const visibleTodos = computed(() => 
  props.note.todos.slice(0, 3)
)

const hasMoreTodos = computed(() => 
  props.note.todos.length > 3
)

const handleClick = () => {
  if (props.note.id) {
    emit('click', props.note.id)
  }
}

const editNote = () => {
  if (props.note.id) {
    emit('edit', props.note.id)
  }
}

const confirmDelete = () => {
  if (props.note.id) {
    emit('delete', props.note.id)
  }
}

const formatDate = (date: Date) => {
  // TODO: Убрать форматтинг
  return new Date(date).toLocaleDateString('ru-RU')
}
</script>

<style scoped lang="scss">
.note-card {
  background: var(--background-card-color);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 320px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  
  &__title {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.1rem;
    line-height: 1.4;
  }
  
  &__actions {
    display: flex;
    gap: 0.5rem;
    transition: opacity 0.2s ease;
  }
  
  &:hover &__actions {
    opacity: 1;
  }
  
  &__todos {
    space-y: 0.5rem;
  }
  
  &__more {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  
  &__meta {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
  }
  
  &__date {
    color: var(--text-secondary);
    font-size: 0.8rem;
  }
}

.todo-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  
  &--done &__text {
    text-decoration: line-through;
    color: var(--text-secondary);
  }
  
  &__checkbox {
    margin: 0;
  }
  
  &__text {
    color: var(--text-primary);
    font-size: 0.9rem;
    line-height: 1.3;
  }
}
</style>