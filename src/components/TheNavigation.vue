<template>
  <header>
    <nav>
      <div class="logo">
        <img class="logo-icon" src="@/assets/logo.webp" />
      </div>
      <form class="nav-form">
        <label for="selectBoard">Board:</label>
        <select
          id="selectBoard"
          v-model="selectedBoard"
          name="selectBoard"
          :class="{ loading: !selectedBoard }"
        >
          <option v-for="value in getBoardNames" :value="value">{{ value }}</option>
        </select>
      </form>
      <base-button customType="navigation" @click="logoutUser">Exit</base-button>
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
$small-mobile-device-size: 26rem;

.logo {
  overflow: hidden;
}

nav {
  font-size: large;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--color-background-nav);
}

.nav-form {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

#selectBoard {
  min-width: 8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  font-size: inherit;
}

@media (max-width: $small-mobile-device-size) {
  nav {
    font-size: large;
    align-items: center;

    #selectBoard {
      min-width: 7rem;
      max-width: 7rem;
      text-overflow: ellipsis;
      font-size: large;
    }
  }
}
</style>
