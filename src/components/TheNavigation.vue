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

<style scoped>
nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--color-background-nav);
  height: 3rem;
}

.nav-form {
  display: flex;
  align-items: center;
  gap: 1rem;
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
</style>
