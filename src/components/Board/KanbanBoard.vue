    <transition-group mode="out-in" name="user-list">
      <kanban-list
        v-for="list in lists"
        :key="list.title"
        :title="list.title"
        :tasks="list.tasks"
        @removeList="removeList"
      />
    </transition-group>
import { mapActions } from 'vuex'
  props: {
    lists: {
      type: Array,
      required: true
    }
  },
    return {}
  },
  methods: {
    ...mapActions(['removeList'])
