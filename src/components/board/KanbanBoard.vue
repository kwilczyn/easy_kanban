<template>
  <div id="board" :class="{ loading: loading }">
    <transition-group
      mode="out-in"
      name="user-list"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
    >
      <kanban-list
        v-for="(list, index) in lists"
        :id="list.id"
        :key="list.title"
        :title="list.title"
        :tasks="list.tasks"
        @removeList="openRemoveListModal"
        :first="index === 0"
        :last="index === lists.length - 1"
      />
    </transition-group>
    <div id="add-list-button-container" v-if="getActiveBoard">
      <base-button customType="add" class="oval" @click="openAddListModal">+</base-button>
      <base-modal v-if="isAddListModalOpen" open @closeModal="isAddListModalOpen = false">
        <template #modalTitle>Add List</template>
        <add-list-form @submitAddList="closeAddListModal" />
      </base-modal>
    </div>
    <base-modal v-if="isRemoveListModalOpen" @closeModal="isRemoveListModalOpen = false">
      <template #modalTitle>Removing List: "{{ listToRemove.title }}"</template>
      <remove-list-form @confirmRemoveList="closeRemoveListModal"></remove-list-form>
    </base-modal>
  </div>
</template>

<script>
import KanbanList from '@/components/board/KanbanList.vue'
import AddListForm from '@/components/forms/AddListForm.vue'
import { mapActions, mapGetters } from 'vuex'
import BaseButton from '../base/BaseButton.vue'
import RemoveListForm from '@/components/forms/RemoveListForm.vue'

export default {
  components: {
    KanbanList,
    AddListForm,
    BaseButton,
    RemoveListForm
  },
  name: 'KanbanBoard',
  props: {
    lists: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      animationSpeed: 500,
      isAddListModalOpen: false,
      isRemoveListModalOpen: false,
      listToRemove: null
    }
  },
  computed: {
    ...mapGetters(['getActiveBoard']),
    loading() {
      return !this.lists || this.$store.state.loadingBoard
    }
  },
  methods: {
    ...mapActions(['removeList', 'addList']),
    openRemoveListModal(payload) {
      this.isRemoveListModalOpen = true
      this.listToRemove = payload
    },
    closeRemoveListModal(payload) {
      this.removeList(this.listToRemove)
      this.isRemoveListModalOpen = false
      this.listToRemove = null
    },
    openAddListModal() {
      this.isAddListModalOpen = true
    },
    closeAddListModal(payload) {
      this.addList(payload)
      this.isAddListModalOpen = false
    },
    onBeforeEnter(el) {
      el.style.opacity = 0
      el.style.transition = `all ${this.animationSpeed}ms ease-out`
    },
    onEnter(el, done) {
      const width = el.offsetWidth
      el.style.width = 0
      el.style.opacity = 1
      el.style.transition = `all ${this.animationSpeed}ms ease-out`
      setTimeout(() => {
        el.style.width = `${width}px`
        done()
      }, this.animationSpeed)
    },

    onBeforeLeave(el) {
      el.style.opacity = 1
      el.style.transition = `all ${this.animationSpeed}ms ease-in`
    },
    onLeave(el, done) {
      // this method is required to keep the original width of the element in removing animation
      const width = el.offsetWidth
      el.style.opacity = 0
      el.style.width = `${width}px`
      el.style.position = 'absolute'
      setTimeout(() => {
        done()
      }, this.animationSpeed)
    }
  }
}
</script>

<style lang="scss" scoped>
$moving-element-speed: 500ms;

#board {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: var(--color-background-board);
  padding: 1rem;
  align-items: stretch;
  align-content: flex-start;
  justify-content: flex-start;
  box-shadow: 1px 1px 10px var(--color-border);
}

#add-list-button-container {
  position: absolute;
  bottom: -1rem;
  right: 0;
  z-index: 10;
}

.user-list-move {
  transition: all $moving-element-speed ease-out;
}
</style>
