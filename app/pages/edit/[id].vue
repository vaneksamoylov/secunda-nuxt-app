<template>
  <div class="note-editor">
    <div class="note-editor__button-container">
      <button class="note-editor__button-back" @click="goBack">Back</button>
      <button class="note-editor__button-save" @click="saveNote">Save</button>
      <button class="note-editor__button-save" @click="resetToInitialState">
        Отменить изменения
      </button>
      <button class="note-editor__button-undo">⎌</button>
      <button class="note-editor__button-redo">Redo</button>
    </div>
    <div v-if="localNote" class="editor-container">
      <!-- Заголовок заметки -->
      <input
        v-model="localNote.title"
        type="text"
        placeholder="Название заметки"
        class="title-input"
      />

      <!-- Список todos -->
      <div class="todos-section">
        <h3>Задачи:</h3>
        <TodoItem
          v-for="(todo, index) in localNote.todos"
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
              console.log('val: ', value);
              todo.text = value;
            }
          "
        ></TodoItem>

        <!-- Кнопка добавления новой задачи -->
        <UiButton @click="addTodo" class="add-todo-btn">
          + Добавить задачу
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();

// Реактивная копия заметки для редактирования
const localNote = ref<Note | null>(null);
const initialNote = ref<Note | null>(null);
const hasChanges = ref(false);

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

// Загружаем данные при монтировании
onMounted(() => {
  notesStore.loadFromStorage();
  loadCurrentNote();
  // Сохраняем начальное состояние для сравнения изменений
  initialNote.value = localNote.value;
  console.log("localNote:", localNote.value);
  console.log("Initial note:", initialNote.value);
});

// Загружаем текущую заметку когда загрузилось хранилище или изменился ID
watchEffect(() => {
  if (notesStore.notes.length > 0 || route.params.id) {
    loadCurrentNote();
  }
});

watch(
  localNote,
  () => {
    if (localNote.value !== initialNote.value) {
      hasChanges.value = true;
      console.log("Внесены изменения!");
    } else {
      hasChanges.value = false;
    }
  },
  { deep: true }
);


function loadCurrentNote() {
  const note = notesStore.getNoteById(route.params.id as string);
  if (note) {
    // Создаем глубокую копию для редактирования
    localNote.value = deepClone(note);
    // Сохраняем глубокую копию для начального состояния
    initialNote.value = deepClone(note);
  } else {
    localNote.value = null;
    initialNote.value = null;
  }
}

function addTodo() {
  if (localNote.value) {
    const newTodo: Todo = {
      id: String(Date.now()), // Простой способ генерации ID
      text: "",
      done: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    localNote.value.todos.push(newTodo);
    saveNote();
  }
}

function removeTodo(index: number) {
  if (localNote.value) {
    localNote.value.todos.splice(index, 1);
    saveNote();
  }
}

function saveNote() {
  if (localNote.value) {
    // Обновляем время изменения
    localNote.value.updatedAt = new Date();

    // Сохраняем в хранилище
    notesStore.updateNote(localNote.value.id, localNote.value);

    if (localNote.value !== initialNote.value) {
      initialNote.value = localNote.value;
    }
  }
}

function goBack() {
  if (hasChanges.value) {
    if (
      confirm(
        "У вас есть несохраненные изменения. Вы уверены, что хотите выйти?"
      )
    ) {
      router.back();
    }
  } else {
    router.back();
  }
}

function resetToInitialState() {
  if (initialNote.value) {
    // Временно обнуляем, чтобы вызвать реактивность
    localNote.value = null;
    
    // Используем nextTick для гарантированного обновления DOM
    nextTick(() => {
      localNote.value = deepClone(initialNote.value);
      console.log("Reset completed with new reference");
    });
  }
}
</script>

<style scoped>
.note-editor {
  display: flex;
  flex-direction: column;
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
