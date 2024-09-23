<template>
  <div id="board">
    <kanban-list v-for="list in lists" :key="list.title" :title="list.title" :tasks="list.tasks" />
  </div>
</template>

<script>
import KanbanList from '@/components/board/KanbanList.vue'

export default {
  components: {
    KanbanList
  },
  name: 'KanbanBoard',
  data() {
    return {
      lists: [
        {
          title: 'To Do',
          tasks: [
            { id: 1, title: 'Task 1', description: 'This is a task description.' },
            { id: 4, title: 'Task 4', description: 'This is the fourth task description.' }
          ]
        },
        {
          title: 'In Progress',
          tasks: [{ id: 2, title: 'Task 2', description: 'This is the second task description.' }]
        },
        {
          title: 'Done',
          tasks: [{ id: 3, title: 'Task 3', description: 'This is the third task description.' }]
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Your component's styles go here */
#board {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  background-color: var(--color-background-board);
  padding: 1rem;
  align-items: stretch;
  justify-content: flex-start;
  flex: 1;
  box-shadow: 1px 1px 10px var(--color-border);
}
</style>
