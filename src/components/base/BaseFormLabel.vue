<template>
  <label :class="{ error_text: fieldValidator }">{{ text }}</label>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    fieldValidator: {
      type: String,
      required: false
    }
  }
}
</script>
