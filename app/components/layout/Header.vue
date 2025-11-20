<template>
  <header class="app-header">
    <NuxtLink to="/" class="app-header__logo">notes</NuxtLink>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--background-color);
  
  &__logo {
    font-family: Ubuntu;
    font-size: var(--text-size-3xl);
    font-weight: bold;
    color: var(--text-primary-color);
    text-decoration: none;
  }
}
</style>