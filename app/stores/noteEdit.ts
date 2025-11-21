import { useRefHistory } from "@vueuse/core";

const STORAGE_KEY = 'noteEdit';

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const useNoteEditStore = defineStore(STORAGE_KEY, () => {
  const localNote = ref<Note | null>(null);
  const { history, undo, redo, canUndo, canRedo } = useRefHistory(localNote, {
    deep: true,
    capacity: 50,
  });

  function loadCurrentNote(note: Note) {
    localNote.value = deepClone(note);
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

  return { localNote, loadCurrentNote, addTodo, removeTodo, setTodoText, undo, redo, canUndo, canRedo, history };
});
