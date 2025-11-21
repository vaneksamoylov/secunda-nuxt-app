<template>
  <header class="app-header">
    <NuxtLink to="/" class="app-header__logo">notes</NuxtLink>
    <NuxtLink to="/edit" class="app-header__button">создать заметку</NuxtLink>
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

  &__button {
    padding: 0.5rem 1rem;
    background-color: #c4fdce;
    color: var(--text-primary-color);
    border-radius: 6px;
    text-decoration: none;
    font-weight: 700;
    transition: background-color 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
  }
}
</style>