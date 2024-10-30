<template>
  <header>
    <nav>
      <div class="logo">Easy Kanban</div>
      <form class="nav-form">
        <label for="selectBoard">Select a board:</label>
        <select id="selectBoard" v-model="selectedBoard" name="selectBoard">
          <option v-for="value in getBoardNames" :value="value">{{ value }}</option>
        </select>
      </form>
      <base-button customType="navigation">Log in</base-button>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TheNavigation',
  computed: {
    ...mapGetters(['getBoardNames'])
  },
  data() {
    return {
      selectedBoard: ''
    }
  },
  created() {
    if (this.getBoardNames.length > 0) {
      this.selectedBoard = this.getBoardNames[0]
    }
  },
  watch: {
    selectedBoard(newValue, oldValue) {
      if (newValue !== oldValue) {
        const bid = this.$store.state.boards.filter((board) => board.title === newValue)[0].id
        this.$store.dispatch('fetchBoard', { boardId: bid })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
