<template>
  <the-header v-if="$store.state.token"></the-header>
  <RouterView />
  <base-modal v-if="communicationError" @closeModal="onCloseModal">
    <template #modalTitle
      >Communication Error<img class="logo-icon" src="@/assets/logo_sad.webp"
    /></template>
    <p>
      Sorry but your request could not be processed. Please try again later or contact
      administrator. Closing this modal will refresh the page.
    </p>
  </base-modal>
</template>

<style scoped></style>

<script>
import { RouterView } from 'vue-router'
import TheHeader from '@/components/TheNavigation.vue'
import { mapState } from 'vuex'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    RouterView,
    TheHeader
  },
  computed: {
    ...mapState(['communicationError'])
  },
  methods: {
    ...mapActions(['resetCommunicationError']),
    onCloseModal() {
      location.reload()
      this.resetCommunicationError()
    }
  },
  created() {
    if (!this.$store.state.token) {
      this.$router.push({ name: 'auth' })
    }
  }
}
</script>
