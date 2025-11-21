<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--disabled': disabled },
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: "default" | "transparent" | "apply" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "md",
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit("click", event);
  }
};
</script>

<style scoped lang="scss">
.btn {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;
  text-transform: lowercase;

  &--default {
    background-color: var(--default-button-color);
    color: var(--default-text-color);
  }

  &--transparent {
    background-color: var(--transparent-button-color);
    color: var(--transparent-text-color);
  }

  &--apply {
    background-color: var(--apply-button-color);
    color: var(--apply-text-color);
  }

  &--danger {
    background-color: var(--danger-button-color);
    color: var(--danger-text-color);
  }

  &--sm {
    padding: 8px 12px;
    font-size: 14px;
  }
  &--md {
    padding: 12px 16px;
    font-size: 16px;
  }
  &--lg {
    padding: 16px 24px;
    font-size: 18px;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 767px) {
    &--sm {
      padding: 4px 6px;
      font-size: 14px;
    }
    &--md {
      padding: 6px 8px;
      font-size: 16px;
    }
    &--lg {
      padding: 8px 12px;
      font-size: 18px;
    }
  }
}
</style>
