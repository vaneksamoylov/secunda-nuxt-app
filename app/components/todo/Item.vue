<template>
  <div class="todo-item">
    <input
      v-model="checkboxValue"
      type="checkbox"
      class="todo-checkbox"
      @change="emit('updateCheckbox', checkboxValue)"
    />
    <input
      v-model="textValue"
      type="text"
      placeholder="Текст задачи"
      class="todo-input"
      :class="{ completed: todo.done }"
      @input="emit('updateText', textValue)"
    />
    <button @click="emit('remove')" class="delete-todo-btn">×</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  todo: Todo
}>()

watch(
  props,
  () => {
    if (textValue.value != props.todo.text) {
      textValue.value = props.todo.text;
    }

    if (checkboxValue.value != props.todo.done) {
      checkboxValue.value = props.todo.done;
    }
  },
  { deep: true }
);

const emit = defineEmits<{
  'remove': []
  'updateCheckbox': [value: boolean]
  'updateText': [value: string]
}>()

const checkboxValue = ref(props.todo.done);
const textValue = ref(props.todo.text);
</script>

<style scoped>
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
  cursor: pointer;
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
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background-color 0.2s;
}

.delete-todo-btn:hover {
  background: #c82333;
}
</style>