<template>
  <div class="modal">
    <button class="modal__close-button" @click="$emit('close')">X</button>
    <div class="modal__text">
      {{ text }}
    </div>
    <div class="modal__buttons">
      <slot></slot>
    </div>
  </div>

  <div class="modal-backdrop"></div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();
defineEmits<{
  close: [];
}>();
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--background-color);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 90%;
  max-width: 800px;

  &__close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--text-primary-color);
  }

  &__text {
    margin-bottom: 1.5rem;
    color: var(--text-primary-color);
    font-size: 1rem;
    text-align: center;
  }

  &__buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  &-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 999;
  }
}
</style>
