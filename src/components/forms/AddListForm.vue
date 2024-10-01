<template>
  <form id="add-list-form" @submit.prevent="submitForm">
    <base-form-row
      label="Title"
      :fieldValidator="titleInvalid"
      type="text"
      name="title"
      v-model.lazy.trim="title"
    />
    <base-button customType="add" type="submit">Add List</base-button>
  </form>
</template>

<script>
export default {
  emits: ['submitAddList'],
  name: 'AddListForm',
  data() {
    return {
      title: '',
      titleInvalid: ''
    }
  },
  methods: {
    submitForm() {
      if (this.validateForm()) {
        this.$emit('submitAddList', { title: this.title })
      }
    },
    validateForm() {
      return this.validateTitle()
    },
    validateTitle() {
      if (this.title.length === 0) {
        this.titleInvalid = 'Title is required'
        return false
      } else if (this.title.length < 3) {
        this.titleInvalid = 'Title must be at least 3 characters'
        return false
      } else if (this.title.length > 20) {
        this.titleInvalid = 'Title must be at most 20 characters'
        return false
      } else if (this.$store.getters['getListTitles'].includes(this.title)) {
        this.titleInvalid = 'Title is already in use'
        return false
      } else {
        this.titleInvalid = ''
        return true
      }
    }
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  button {
    margin-top: 1rem;
  }
}
</style>
