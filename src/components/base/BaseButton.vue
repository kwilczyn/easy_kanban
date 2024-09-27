<template>
  <button :class="[$attrs.customType]">
    <slot>...</slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton'
}
</script>

<style scoped>
button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  appearance: none;
  color: inherit;
  border: none;
  white-space: nowrap;
}

.delete {
  background-color: var(--color-delete);
  border: none;
}

.burger {
  background-color: transparent;
  border: none;
  color: var(--color-text);
}

.navigation {
  background-color: var(--color-nav-buttons);
  border: 1px solid var(--color-text);
  min-width: 5.2rem;
  font-size: inherit;
}
</style>
