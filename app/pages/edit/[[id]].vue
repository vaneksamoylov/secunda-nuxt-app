<template>
  <div class="note-editor">
    <div class="note-editor__button-container">
      <UiButton variant="default" class="note-editor__button-back" @click="goBack">Назад</UiButton>
      <UiButton variant="apply" class="note-editor__button-save" @click="saveNote">Сохранить</UiButton>
      <UiButton variant="danger" class="note-editor__button-save" :disabled="!route.params.id" @click="resetToInitialState">
        Отменить изменения
      </UiButton>
      <UiButton variant="danger" size="sm" @click="confirmDelete" :disabled="!route.params.id">
        🗑️
      </UiButton>
      <UiButton class="note-editor__button-undo" :disabled="!noteEditStore.canUndo && !route.params.id" @click="noteEditStore.undo">
        Undo
      </UiButton>
      <UiButton class="note-editor__button-redo" :disabled="!noteEditStore.canRedo && !route.params.id" @click="noteEditStore.redo">
        Redo
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
          @updateCheckbox="
            (value) => {
              todo.done = value;
            }
          "
          @updateText="
            (value) => {
              noteEditStore.setTodoText(index, value);
            }
          "
          @enterPress="handleEnterPress"
        ></TodoItem>

        <!-- Кнопка добавления новой задачи -->
        <UiButton @click="addTodo" class="add-todo-btn">
          + Добавить задачу
        </UiButton>
      </div>
    </div>
  </div>

  <UiModal v-if="showModal" :text="modalText" @close="closeModal">
    <UiButton v-for="btn in modalButtons" @click="btn.action()">{{
      btn.text
    }}</UiButton>
  </UiModal>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();
const noteEditStore = useNoteEditStore();
const showModal = ref(false);

const modalText = ref('');
const modalButtons = ref();

// Реактивная копия заметки для редактирования
const initialNote = ref<Note | null>(null);

const newLocalNote = storeToRefs(noteEditStore).localNote;
const todos = ref<Array<Todo>>([]);

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

// Загружаем данные при монтировании
onMounted(() => {
  if (route.params.id) {
    notesStore.loadFromStorage();
    loadCurrentNote();
  } else {
    newLocalNote.value = notesStore.createEmptyNote();
    addTodo()
  }
});

// Загружаем текущую заметку когда загрузилось хранилище или изменился ID
watchEffect(() => {
  if (notesStore.notes.length > 0 || route.params.id) {
    loadCurrentNote();
  }
});

watch(
  newLocalNote,
  () => {
    todos.value = newLocalNote.value?.todos ?? [];
  },
  { deep: true }
);

function loadCurrentNote() {
  const note = notesStore.getNoteById(route.params.id as string);
  if (note) {
    noteEditStore.loadCurrentNote(note);
    initialNote.value = note;
  } else {
    // TODO: ошибка
  }
}

function addTodo() {
  noteEditStore.addTodo();
}

function removeTodo(index: number) {
  noteEditStore.removeTodo(index);
}

function closeModal() {
  showModal.value = false;
  modalButtons.value = [];
}

function confirmDelete() {
  showModal.value = true;

  modalText.value = 'Вы уверены, что хотите удалить эту заметку?';
  modalButtons.value = [
    {
      text: 'Удалить',
      action: () => {
        deleteNote();
        closeModal();
      },
    },
    {
      text: 'Отмена',
      action: () => {
        closeModal();
      },
    },
  ];
}

function saveNote() {
  if (newLocalNote.value) {
    const noteToSave = deepClone(newLocalNote.value);

    console.log('noteToSave: ', noteToSave);


    if (noteToSave.id === '' && noteToSave.title !== '') {
      console.log("noteToSave.id === '' && noteToSave.title !== ''")
      console.log("noteToSave.id:", noteToSave.id)
      console.log("noteToSave.title:", noteToSave.title)

      noteToSave.id = notesStore.generateId();
      noteToSave.updatedAt = new Date();
      notesStore.createNote(noteToSave);
      navigateTo(`/edit/${noteToSave.id}`);
    }

    if (noteToSave.id === '' && noteToSave.title === '') {
      console.log("noteToSave.id !== '' && noteToSave.title === ''")
      console.log("noteToSave.id:", noteToSave.id)
      console.log("noteToSave.title:", noteToSave.title)
      console.log('open modal')
      showModal.value = true;

      modalText.value = 'Заметка пустая. Добавьте заголовок, чтобы сохранить заметку.';
      modalButtons.value = [
        {
          text: 'Ок',
          action: () => {
            closeModal()
          },
        },
      ];

      return;
    }

    if (noteToSave.id !== '' && noteToSave.title !== '') {
      notesStore.updateNote(noteToSave.id, noteToSave);
    }
  }

  if (newLocalNote.value !== initialNote.value) {
    console.log("loadCurrentNote")
    loadCurrentNote();
  }
}

function goBack() {
  if (noteEditStore.history.length > 0) {
    showModal.value = true;
    modalText.value = 'У вас есть несохраненные изменения. Вы уверены, что хотите вернуться назад?';
    modalButtons.value = [
      {
        text: 'Да',
        action: () => {
          closeModal();
          navigateTo('/');
        },
      },
      {
        text: 'Отмена',
        action: () => {
          closeModal();
        },
      },
    ];
    return;
  }
  router.back();
}

function resetToInitialState() {
  showModal.value = true;
  modalText.value = 'Вы уверены, что хотите отменить все изменения?';
  modalButtons.value = [
    {
      text: 'Да',
      action: () => {
        loadCurrentNote();
        closeModal();
      },
    },
    {
      text: 'Отмена',
      action: () => {
        closeModal();
      },
    },
  ];
}

function deleteNote() {
  notesStore.deleteNote(route.params.id as string);
  navigateTo('/');
}

const handleEnterPress = (event: Event) => {
  addTodo()
  
  const target = event.target as HTMLInputElement
  const nextElement = target.nextElementSibling as HTMLInputElement | null
  
  nextTick(() => {
    if (nextElement && 'focus' in nextElement) {
      nextElement.focus()
    }
  })
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
