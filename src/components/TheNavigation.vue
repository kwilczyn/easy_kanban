<template>
  <header>
    <nav>
      <div class="logo">Easy Kanban</div>
      <form class="nav-form">
        <label for="selectBoard">Select a board:</label>
        <select id="selectBoard" type="select">
          <option value="My Simple Kanban Board!">My Simple Kanban Board!</option>
        </select>
      </form>
      <base-button customType="navigation">Log in</base-button>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'TheNavigation',
  data() {
    return {
      selectedBoard: 'My Simple Kanban Board!'
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

#selectBoard {
  appearance: none;
  padding: 0.5rem;
  border: 1px solid #caced1;
  border-radius: 0.25rem;
  color: var(--text-color);
  background-color: var(--background-color);
  cursor: pointer;
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
