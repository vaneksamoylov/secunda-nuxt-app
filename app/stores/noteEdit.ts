import { useRefHistory } from "@vueuse/core";

const STORAGE_KEY = "noteEdit";

export const useNoteEditStore = defineStore(STORAGE_KEY, () => {
  const localNote = ref<Note | null>(null);
  const history = useRefHistory(localNote, {
    deep: true,
    capacity: 50,
  });

  function loadCurrentNote(note: Note) {
    localNote.value = deepClone(note);
  }

  function addTodo() {
    if (localNote.value) {
      // Используем комбинацию timestamp и random для избежания коллизий
      const newTodo: Todo = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        text: "",
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      localNote.value.todos.push(newTodo);
    }
  }

  function removeTodo(index: number) {
    if (localNote.value) {
      localNote.value.todos.splice(index, 1);
    }
  }

  function setTodoText(index: number, text: string) {
    if (localNote.value) {
      localNote.value.todos[index]!.text = text;
    }
  }

  return {
    localNote,
    loadCurrentNote,
    addTodo,
    removeTodo,
    setTodoText,
    history,
  };
});
