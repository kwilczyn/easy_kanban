<template>
  <header>
    <nav>
      <div class="logo">Easy Kanban</div>
      <form class="nav-form">
        <label for="selectBoard">Select a board:</label>
        <select
          id="selectBoard"
          v-model="selectedBoard"
          name="selectBoard"
          :class="{ loading: !selectedBoard }"
        >
          <option v-for="value in getBoardNames" :value="value">{{ value }}</option>
        </select>
      </form>
      <base-button customType="navigation" @click="logoutUser">Log out</base-button>
    </nav>
  </header>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'TheNavigation',
  computed: {
    ...mapGetters(['getBoardNames']),
    ...mapState(['boards'])
  },
  data() {
    return {
      selectedBoard: ''
    }
  },
  methods: {
    ...mapActions(['logoutUser'])
  },
  watch: {
    selectedBoard(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (this.$store.state.boards.length === 0) {
          return
        }
        const bid = this.$store.state.boards.filter((board) => board.title === newValue)[0].id
        this.$store.dispatch('fetchBoard', { boardId: bid })
      }
    }
  },
  beforeMount() {
    this.selectedBoard = this.getBoardNames[0]
  },
  beforeUpdate() {
    if (!this.selectedBoard) {
      this.selectedBoard = this.getBoardNames[0]
    }
  }
}
</script>

<style lang="scss">
$mobile-device-size: 78rem;

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  gap: 1rem;
  background-color: var(--color-background-nav);
}

.nav-form {
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap;
  flex-wrap: wrap;
}

#selectBoard {
  min-width: 8.5rem;
}

@media (max-width: $mobile-device-size) {
  nav {
    font-size: large;
    align-items: flex-start;
  }

  .logo {
    display: none;
  }
}
</style>
