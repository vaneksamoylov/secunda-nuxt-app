<template>
  <div class="layout">
    <LayoutHeader />
    <main class="layout__content">
      <slot></slot>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1920px;
  width: 100%;
  height: 100vh; /* Занимаем всю высоту viewport */
  background-color: var(--background-color);
  color: var(--text-color);

  &__content {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    min-height: 0; /* Важно для правильной работы flex в Chrome */
  }
}
</style>
