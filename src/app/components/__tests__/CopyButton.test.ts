// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CopyButton from '../CopyButton.vue'

const writeText = vi.fn().mockResolvedValue(undefined)
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText },
  writable: true,
  configurable: true,
})

describe('CopyButton', () => {
  it('should render a button', () => {
    const wrapper = mount(CopyButton, {
      props: { text: 'hello' },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should copy text to clipboard on click', async () => {
    const wrapper = mount(CopyButton, {
      props: { text: 'hello' },
    })
    await wrapper.find('button').trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello')
  })
})
