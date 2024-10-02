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
  padding: 0.5rem 0.8rem;
  border-radius: 0.25rem;
  cursor: pointer;
  appearance: none;
  color: inherit;
  border: none;
  white-space: nowrap;
  background-color: transparent;
  transition: all 0.2s;
}

button:hover,
button:focus {
  filter: brightness(1.1);
  transform: scale(1.04);
}

.delete {
  background-color: var(--color-delete);
  border: none;
  font-weight: bold;
}

.add {
  background-color: var(--color-add);
  border: none;
  font-weight: bold;
}

.oval {
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 1rem;
  border-radius: 50%;
}

.burger {
  background-color: transparent;
  border: none;
  color: var(--color-text);
  font-weight: bold;
}

.navigation {
  background-color: var(--color-nav-buttons);
  border: 1px solid var(--color-text);
  min-width: 5.2rem;
  font-size: inherit;
}
</style>
