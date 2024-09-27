<template>
  <div id="board">
    <transition-group mode="out-in" name="user-list" @before-leave="onBeforeLeave" @leave="onLeave">
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
    return {
      animationSpeed: 500
    }
  },
  methods: {
    ...mapActions(['removeList']),
    onBeforeLeave(el) {
      console.log('onBeforeLeave')
      el.style.opacity = 1
      el.style.transition = `all ${this.animationSpeed}ms ease-in`
    },
    onLeave(el, done) {
      // this method is required to keep the original width of the element in removing animation
      console.log('onLeave')
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: var(--color-background-board);
  padding: 1rem;
  align-items: stretch;
  align-content: flex-start;
  justify-content: flex-start;
  flex: 1;
  box-shadow: 1px 1px 10px var(--color-border);
}

.user-list-move {
  transition: all $moving-element-speed ease-out;
}
</style>
