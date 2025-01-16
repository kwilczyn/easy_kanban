import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RemoveListForm from '@/components/forms/RemoveListForm.vue'
import BaseButton from '@/components/base/BaseButton.vue'

describe('RemoveListForm', () => {
  it('emits confirmRemoveList event when Yes button is clicked', async () => {
    const wrapper = mount(RemoveListForm, {
      global: {
        components: { BaseButton }
      }
    })
    await wrapper.find('.content button.delete').trigger('click')
    expect(wrapper.emitted('confirmRemoveList')).toBeTruthy()
  })
})
