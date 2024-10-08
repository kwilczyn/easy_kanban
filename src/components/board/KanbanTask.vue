<template>
  <div class="kanban-task" @drop="onDrop" @dragover.prevent @dragenter.prevent>
    <header class="kanban-task__header">
      <h3>{{ task.title }}</h3>
      <base-button customType="burger" @click.stop="toggleDropdown"></base-button>
      <base-dropdown v-if="isDropdownVisible" v-click-outside="toggleDropdown">
        <base-button customType="delete" @click="removeTask">Delete Task</base-button>
        <base-button @click="editTask">Edit Task</base-button>
        <label for="selectMove">Move to:</label>
        <select id="selectMove" @change="onSelectionChange" name="selectMove">
          <option value="" selected disabled hidden>Choose here</option>
          <option v-for="title in getListTitles" :value="title">{{ title }}</option>
        </select>
      </base-dropdown>
    </header>
    <div class="task-description">{{ task.description }}</div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'KanbanTask',
  emits: ['removeTask', 'openEditModal', 'moveTask'],
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDropdownVisible: false
    }
  },
  computed: {
    getListTitles() {
      return this.$store.getters['getListTitles']
    }
  },
  methods: {
    ...mapActions(['moveTaskAbove']),
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible
    },
    removeTask() {
      this.$emit('removeTask', { taskId: this.task.id })
    },
    editTask() {
      this.$emit('openEditModal', this.task)
    },
    onSelectionChange(event) {
      this.$emit('moveTask', { to: event.target.value, taskId: this.task.id })
    },
    onDrop(event) {
      const taskId = event.dataTransfer.getData('taskId')
      this.moveTaskAbove({ taskId: taskId, targetTaskId: this.task.id })
      event.stopPropagation()
    }
  }
}
</script>

<style scoped>
.kanban-task {
  background-color: var(--color-background-card);
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.1);
}

.kanban-task__header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav label,
nav select {
  text-align: center;
  padding: 0.5rem 0.8rem;
  border-radius: 0.25rem;
  font-size: 1rem;
}
</style>
