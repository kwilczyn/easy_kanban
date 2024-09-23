<template>
  <main>
    <kanban-board></kanban-board>
  </main>
</template>

<script>
import KanbanBoard from '@/components/board/KanbanBoard.vue'

export default {
  name: 'HomeView',
  components: {
    KanbanBoard
  },
  data() {
    return {
      boardTitle: 'My Simple Kanban Board!'
    }
  }
}
</script>

<style scoped>
#boardTitle {
  padding: 1rem;
}

main {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 3rem);
}
</style>
