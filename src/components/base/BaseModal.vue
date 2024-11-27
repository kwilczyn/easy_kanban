<template>
  <teleport to="body">
    <div class="backdrop" @click="closeModal" />
    <dialog id="modal">
      <header>
        <h2><slot name="modalTitle"> Modal Title</slot></h2>
        <base-button customType="delete" @click="closeModal">X</base-button>
      </header>
      <div id="modal-content">
        <slot></slot>
      </div>
    </dialog>
  </teleport>
</template>

<script>
import BaseButtonVue from './BaseButton.vue'

export default {
  name: 'BaseModal',
  emits: ['closeModal'],
  methods: {
    closeModal() {
      this.$emit('closeModal')
    }
  }
}
</script>

<style scoped>
h2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

#modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-background-list);
  z-index: 100;
  border-radius: 0.25rem;
  border-width: 0;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 20rem;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 99;
}
</style>
