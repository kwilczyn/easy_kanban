<template>
  <form id="add-task-form" @submit.prevent="submitForm">
    <base-form-row
      label="Title"
      :fieldValidator="titleInvalid"
      type="text"
      name="title"
      v-model.lazy.trim="title"
    />
    <base-form-row
      label="Description"
      :fieldValidator="descriptionInvalid"
      type="text"
      name="description"
      v-model.lazy.trim="description"
      inputType="textarea"
    />
    <base-button v-if="!isEditMode" customType="add" type="submit">Add Task</base-button>
    <base-button v-else customType="add" type="submit">Update Task</base-button>
  </form>
</template>

<script>
export default {
  emits: ['submitAddTask'],
  name: 'AddTaskForm',
  props: {
    task: {
      type: Object,
      required: false,
      default: { id: '', title: '', description: '' }
    },
    existingTaskTitles: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      id: this.task.id,
      title: this.task.title,
      titleInvalid: '',
      description: this.task.description,
      descriptionInvalid: ''
    }
  },
  computed: {
    isEditMode() {
      return this.task.id ? true : false
    }
  },
  methods: {
    submitForm() {
      if (this.validateForm()) {
        this.$emit('submitAddTask', {
          taskId: this.id,
          title: this.title,
          description: this.description
        })
      }
    },
    validateForm() {
      let titleValid = this.validateTitle()
      let descriptionValid = this.validateDescription()
      return titleValid && descriptionValid
    },
    validateTitle() {
      if (this.title.length === 0) {
        this.titleInvalid = 'Title is required'
      } else if (this.title.length < 3) {
        this.titleInvalid = 'Title must be at least 3 characters'
      } else if (this.title.length > 50) {
        this.titleInvalid = 'Title must be at most 50 characters'
      } else if (this.existingTaskTitles.includes(this.title) && !this.isEditMode) {
        this.titleInvalid = 'Title is already in use'
      } else {
        this.titleInvalid = ''
        return true
      }
      return false
    },
    validateDescription() {
      if (this.description && this.description.length > 100) {
        this.descriptionInvalid = 'Description must be at most 100 characters'
      } else {
        this.descriptionInvalid = ''
        return true
      }
      return false
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
