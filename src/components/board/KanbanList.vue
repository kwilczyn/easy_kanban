<template>
  <section class="kanban-list" @drop="onDrop" @dragover.prevent @dragenter.prevent>
    <header>
      <h2>{{ title }}</h2>
      <base-button customType="delete" @click="removeList">X</base-button>
    </header>
    <ul id="tasks-list">
      <li
        v-for="task in tasks"
        :key="task.id"
        draggable="true"
        :id="task.id"
        @dragstart="startDrag"
      >
        <kanban-task
          :task="task"
          @removeTask="onRemoveTask"
          @openEditModal="onOpenEditModal"
          @moveTask="onMoveTask"
        />
      </li>
      <li id="addTaskButtonWrapper">
        <base-button customType="add" @click="openAddTaskModal">+</base-button>
        <base-modal v-if="isAddTaskModalVisible" open @closeModal="closeTaskModal">
          <template #modalTitle>{{ isEditMode ? 'Edit Task' : 'Add Task' }}</template>
          <task-form
            @submitAddTask="onSubmitAddTaskForm"
            :existingTaskTitles="getTaskTitles(title)"
            :task="editedTask"
          />
        </base-modal>
      </li>
    </ul>
  </section>
</template>

<script>
import KanbanTask from '@/components/board/KanbanTask.vue'
import TaskForm from '@/components/forms/TaskForm.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { KanbanTask, TaskForm },
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
      isAddTaskModalVisible: false,
      editedTask: {}
    }
  },
  computed: {
    ...mapGetters(['getTaskTitles']),
    isEditMode() {
      return this.editedTask.id ? true : false
    }
  },
  methods: {
    ...mapActions(['removeTask', 'addTask', 'updateTask', 'moveTask']),
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
      if (this.isEditMode) {
        this.updateTask({ listTitle: this.title, ...payload })
      } else {
        this.addTask({ listTitle: this.title, ...payload })
      }
      this.closeTaskModal()
    },
    onOpenEditModal(task) {
      this.editedTask = task
      this.isAddTaskModalVisible = true
    },
    closeTaskModal() {
      this.isAddTaskModalVisible = false
      this.editedTask = {}
    },
    onMoveTask({ to, taskId }) {
      if (to !== this.title) {
        this.moveTask({ from: this.title, to, taskId })
      }
    },
    onDrop(event) {
      const taskId = event.dataTransfer.getData('taskId')
      const from = event.dataTransfer.getData('from')
      this.moveTask({ from: from, to: this.title, taskId: Number(taskId) })
      event.stopPropagation()
    },
    startDrag(event) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('taskId', event.target.id)
      event.dataTransfer.setData('from', this.title)
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
