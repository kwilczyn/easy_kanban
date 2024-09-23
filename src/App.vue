<template>
  <the-header></the-header>
  <RouterView />
</template>

<style scoped></style>

<script>
import { RouterView } from 'vue-router'
import TheHeader from '@/components/TheNavigation.vue'

export default {
  name: 'App',
  components: {
    RouterView,
    TheHeader
  }
}
</script>
