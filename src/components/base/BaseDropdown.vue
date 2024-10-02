<template>
  <nav role="navigation" class="dropdown" ref="dropdown">
    <slot>...</slot>
  </nav>
</template>

<script>
export default {
  name: 'BaseDropdown',
  mounted() {
    this.$refs.dropdown.focus()
  }
}
</script>

<style scoped>
.dropdown {
  position: absolute;
  top: 2rem;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  padding: 0.5rem 1rem;
  background-color: var(--color-background-list);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  cursor: pointer;
  min-width: 10rem;
}
</style>
