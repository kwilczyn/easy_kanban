<template>
  <div class="content">
    <p>Are you sure you want to remove this list, including all the cards assigned?</p>
    <base-button customType="delete" @click="onConfirm">Yes</base-button>
  </div>
</template>

<script>
export default {
  name: 'RemoveListForm',
  emits: ['confirmRemoveList'],
  methods: {
    onConfirm() {
      this.$emit('confirmRemoveList')
    }
  }
}
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
</style>
