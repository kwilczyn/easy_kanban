<template>
  <div id="board">
    <transition-group mode="out-in" name="user-list">
      <kanban-list
        v-for="list in lists"
        :key="list.title"
        :title="list.title"
        :tasks="list.tasks"
        @removeList="removeList"
      />
    </transition-group>
  </div>
</template>

<script>
import KanbanList from '@/components/board/KanbanList.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    KanbanList
  },
  name: 'KanbanBoard',
  props: {
    lists: {
      type: Array,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions(['removeList'])
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

.user-list-enter-from {
  opacity: 0;
  flex-grow: 0;
  width: 0;
  margin: 0;
  padding: 0;
}

.user-list-enter-active {
  transition: all 0.3s ease-out;
}

.user-list-enter-to {
  opacity: 1;
  flex-grow: 1;
}

.user-list-leave-from {
  opacity: 1;
  flex-grow: 1;
}

.user-list-leave-active {
  transition:
    all 0.3s ease-in,
    opacity 0.2s ease-in;
}

.user-list-leave-to {
  opacity: 0;
  flex-grow: 0;
  width: 0;
  margin: 0;
  padding: 0;
}
</style>
