<template>
  <div class="kanban-task">
    <header class="kanban-task__header">
      <h3>{{ task.title }}</h3>
      <base-button customType="burger"></base-button>
    </header>
    <div class="task-description">{{ task.description }}</div>
  </div>
</template>

<script>
export default {
  name: 'KanbanTask',
  props: {
    task: {
      type: Object,
      required: true
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
