<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--disabled': disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'rounded' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped lang="scss">
.btn {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &--primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover:not(.btn--disabled) {
      background-color: var(--primary-dark);
    }
  }
  
  &--danger {
    background-color: var(--error-color);
    color: white;
    
    &:hover:not(.btn--disabled) {
      background-color: var(--error-dark);
    }
  }

  &--rounded {
    background-color: var(--primary-color);
    color: white;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    padding: 0;

    &:hover:not(.btn--disabled) {
      background-color: var(--primary-dark);
    }
  }

  &--purple {
    background-color: #d715b0;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  &--sm { padding: 8px 12px; font-size: 14px; }
  &--md { padding: 12px 16px; font-size: 16px; }
  &--lg { padding: 16px 24px; font-size: 18px; }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>