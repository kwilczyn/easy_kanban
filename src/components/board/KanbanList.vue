<template>
  <section class="kanban-list">
    <header>
      <h2>{{ title }}</h2>
      <base-button customType="delete" @click="removeList">X</base-button>
    </header>
    <ul id="tasks-list">
      <li v-for="task in tasks" :key="task.id">
        <kanban-task :task="task" @removeTask="onRemoveTask" />
      </li>
      <li id="addTaskButtonWrapper">
        <base-button customType="add" @click="openAddTaskModal">+</base-button>
        <base-modal v-if="isAddTaskModalVisible" open @closeModal="isAddTaskModalVisible = false">
          <template #modalTitle>Add Task</template>
          <add-task-form
            @submitAddTask="onSubmitAddTaskForm"
            :existingTaskTitles="getTaskTitles(title)"
          />
        </base-modal>
      </li>
    </ul>
  </section>
</template>

<script>
import KanbanTask from '@/components/board/KanbanTask.vue'
import AddTaskForm from '@/components/forms/AddTaskForm.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { KanbanTask, AddTaskForm },
  emits: ['removeList'],
  name: 'KanbanList',
  props: {
    title: {
      type: String,
      required: true
    },
    tasks: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isAddTaskModalVisible: false
    }
  },
  computed: {
    ...mapGetters(['getTaskTitles'])
  },
  methods: {
    ...mapActions(['removeTask', 'addTask']),
    onRemoveTask(task) {
      this.removeTask({ listTitle: this.title, ...task })
    },
    removeList() {
      this.$emit('removeList', { title: this.title })
    },
    openAddTaskModal() {
      this.isAddTaskModalVisible = true
    },
    onSubmitAddTaskForm(payload) {
      console.log('onCloseAddTaskModal', payload)
      this.addTask({ listTitle: this.title, ...payload })
      this.isAddTaskModalVisible = false
    }
  }
}
</script>

<style scoped>
.kanban-list {
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-list);
  padding: 1rem;
  gap: 1rem;
  border-radius: 0.25rem;
  box-shadow: 1px 1px 3px var(--color-border);
  flex: 1;
  height: fit-content;
  min-width: 20rem;
}

header {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
}

#tasks-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
