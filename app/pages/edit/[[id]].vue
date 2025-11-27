<template>
  <div class="note-editor">
    <div class="note-editor__button-container">
      <UiButton
        variant="default"
        class="note-editor__button-back"
        @click="goBack"
        >Назад</UiButton
      >
      <UiButton
        variant="apply"
        class="note-editor__button-save"
        @click="saveNote"
      >
        <UiIconSave current-color="#fff" width="24" height="24" />
      </UiButton>
      <UiButton
        variant="danger"
        class="note-editor__button-save"
        :disabled="!route.params.id"
        @click="resetToInitialState"
      >
        Отменить изменения
      </UiButton>
      <UiButton
        variant="danger"
        size="sm"
        :disabled="!route.params.id"
        @click="confirmDelete"
      >
        <UiIconDelete current-color="#fff" width="24" height="24" />
      </UiButton>
      <UiButton
        class="note-editor__button-undo"
        :disabled="!noteEditStore.history.canUndo"
        @click="noteEditStore.history.undo"
      >
        <UiIconUndo current-color="#fff" width="24" height="24" />
      </UiButton>
      <UiButton
        class="note-editor__button-redo"
        :disabled="!noteEditStore.history.canRedo"
        @click="noteEditStore.history.redo"
      >
        <UiIconRedo current-color="#fff" width="24" height="24" />
      </UiButton>
    </div>
    <div v-if="newLocalNote" class="editor-container">
      <!-- Заголовок заметки -->
      <input
        v-model="newLocalNote.title"
        type="text"
        placeholder="Название заметки"
        class="title-input"
      />

      <!-- Список todos -->
      <div class="todos-section">
        <h3>Задачи:</h3>
        <TodoItem
          v-for="(todo, index) in todos"
          :key="todo.id"
          class="todo-item"
          :todo="todo"
          @remove="removeTodo(index)"
          @update-checkbox="
            (value) => {
              todo.done = value;
            }
          "
          @update-text="
            (value) => {
              noteEditStore.setTodoText(index, value);
            }
          "
        ></TodoItem>

        <!-- Кнопка добавления новой задачи -->
        <UiButton class="add-todo-btn" @click="addTodo">
          + Добавить задачу
        </UiButton>
      </div>
    </div>
  </div>

  <UiModal v-if="showModal" :text="modalText" @close="closeModal">
    <UiButton
      v-for="btn in modalButtons"
      :key="btn.text"
      :variant="btn.variant"
      @click="btn.action()"
    >
      {{ btn.text }}
    </UiButton>
  </UiModal>
</template>

<script setup lang="ts">
const route = useRoute();
const notesStore = useNotesStore();
const noteEditStore = useNoteEditStore();
const { showModal, modalText, modalButtons, openModal, closeModal } =
  useModal();

// Реактивная копия заметки для редактирования
const initialNote = ref<Note | null>(null);

const newLocalNote = storeToRefs(noteEditStore).localNote;

// Используем computed вместо watch для лучшей производительности
const todos = computed(() => newLocalNote.value?.todos ?? []);

// Keyboard shortcuts для undo/redo
const handleKeyDown = (event: KeyboardEvent) => {
  // Ctrl+Z для undo
  if (event.ctrlKey && event.key === "z" && !event.shiftKey) {
    event.preventDefault();
    if (noteEditStore.history.canUndo) {
      noteEditStore.history.undo();
    }
  }
  // Shift+Ctrl+Z или Ctrl+Y для redo
  if (
    (event.ctrlKey && event.shiftKey && event.key === "z") ||
    (event.ctrlKey && event.key === "y")
  ) {
    event.preventDefault();
    if (noteEditStore.history.canRedo) {
      noteEditStore.history.redo();
    }
  }
};

// Загружаем данные при монтировании
onMounted(() => {
  notesStore.loadFromStorage();

  if (route.params.id) {
    loadCurrentNote();
  } else {
    loadNewNote();
  }

  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

// Оптимизированный watch для загрузки заметки
watch(
  () => [route.params.id, notesStore.isLoaded],
  ([id, isLoaded]) => {
    if (isLoaded && id) {
      loadCurrentNote();
    }
  },
  { immediate: true }
);

async function loadCurrentNote() {
  const note = notesStore.getNoteById(route.params.id as string);

  if (note) {
    noteEditStore.loadCurrentNote(note);
    initialNote.value = note;

    await nextTick();
    noteEditStore.history.clear();
  }
}

async function loadNewNote() {
  const newNote = notesStore.createEmptyNote();

  noteEditStore.loadCurrentNote(newNote);
  noteEditStore.addTodo();

  await nextTick();
  noteEditStore.history.clear();

  initialNote.value = newNote;
}

function addTodo() {
  noteEditStore.addTodo();
}

function removeTodo(index: number) {
  noteEditStore.removeTodo(index);
}

function confirmDelete() {
  openModal("Вы уверены, что хотите удалить эту заметку?", [
    {
      text: "Удалить",
      variant: "danger" as const,
      action: () => {
        deleteNote();
        closeModal();
      },
    },
    {
      text: "Отмена",
      variant: "default" as const,
      action: () => {
        closeModal();
      },
    },
  ]);
}

function saveNote() {
  if (newLocalNote.value) {
    const noteToSave = deepClone(newLocalNote.value);

    if (noteToSave.id === "" && noteToSave.title !== "") {
      noteToSave.id = notesStore.generateId();
      noteToSave.updatedAt = new Date();
      notesStore.createNote(noteToSave);
      navigateTo(`/edit/${noteToSave.id}`);
    }

    if (noteToSave.id === "" && noteToSave.title === "") {
      openModal(
        "Заметка пустая. Добавьте заголовок, чтобы сохранить заметку.",
        [
          {
            text: "Ок",
            variant: "default" as const,
            action: () => {
              closeModal();
            },
          },
        ]
      );

      return;
    }

    if (noteToSave.id !== "" && noteToSave.title !== "") {
      notesStore.updateNote(noteToSave.id, noteToSave);
    }
  }

  if (hasChanges.value) {
    loadCurrentNote();
  }
}

// Computed для проверки изменений
const hasChanges = computed(() => {
  if (!newLocalNote.value || !initialNote.value) return false;
  return (
    JSON.stringify(newLocalNote.value) !== JSON.stringify(initialNote.value)
  );
});

function goBack() {
  if (hasChanges.value) {
    openModal(
      "У вас есть несохраненные изменения. Вы уверены, что хотите вернуться назад?",
      [
        {
          text: "Да",
          variant: "default" as const,
          action: () => {
            closeModal();
            navigateTo("/");
          },
        },
        {
          text: "Отмена",
          variant: "default" as const,
          action: () => {
            closeModal();
          },
        },
      ]
    );
  } else {
    navigateTo("/");
  }
}

function resetToInitialState() {
  openModal("Вы уверены, что хотите отменить все изменения?", [
    {
      text: "Да",
      variant: "default" as const,
      action: () => {
        loadCurrentNote();
        closeModal();
      },
    },
    {
      text: "Отмена",
      variant: "default" as const,
      action: () => {
        closeModal();
      },
    },
  ]);
}

function deleteNote() {
  notesStore.deleteNote(route.params.id as string);
  navigateTo("/");
}
</script>

<style scoped lang="scss">
.note-editor {
  display: flex;
  flex-direction: column;

  &__button-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
}

.editor-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title-input {
  font-size: 1.5rem;
  font-weight: bold;
  padding: 10px;
  outline: none;
  background-color: var(--background-color);
  border: none;
}

.title-input:focus {
  border-color: #007bff;
}

.todos-section {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 20px;
}

.todos-section h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.todo-item:hover {
  background-color: #f8f9fa;
}

.todo-checkbox {
  width: 18px;
  height: 18px;
}

.todo-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

.todo-input:focus {
  border-color: #007bff;
}

.todo-input.completed {
  text-decoration: line-through;
  color: #6c757d;
  background-color: #f8f9fa;
}

.delete-todo-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 100%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: 16px;
  transition: background-color 0.2s;
}

.delete-todo-btn:hover {
  background: #c82333;
}

.add-todo-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-todo-btn:hover {
  background: #218838;
}

.note-info {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #6c757d;
}

.note-info p {
  margin: 5px 0;
}

.not-found {
  text-align: center;
  padding: 40px;
}

.back-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
}

.back-btn:hover {
  background: #0056b3;
}
</style>
