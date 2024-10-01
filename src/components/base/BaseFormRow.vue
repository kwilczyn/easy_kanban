<template>
  <div class="form-row">
    <div class="row-controls">
      <form-label :for="name" :text="label" :fieldValidator="fieldValidator" />
      <input
        :value="modelValue"
        :class="{ error_border: fieldValidator }"
        :type="type"
        :name="name"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <p v-if="fieldValidator" class="error_text">{{ fieldValidator }}</p>
  </div>
</template>

<script>
import BaseFormLabel from '@/components/base/BaseFormLabel.vue'

export default {
  emits: ['update:modelValue'],
  components: {
    FormLabel: BaseFormLabel
  },
  props: {
    fieldValidator: {
      type: String,
      required: false
    },
    label: {
      type: String,
      required: true
    },
    type: String,
    label: String,
    name: String,
    modelValue: String
  }
}
</script>

<style>
.form-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.row-controls {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
}

input {
  background-color: var(--color-background-card);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--vt-c-black);
  color: inherit;
  font: inherit;
}
</style>
