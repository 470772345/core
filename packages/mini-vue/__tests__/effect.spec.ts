import { reactive } from '../src/reactive'
import { effect } from '../src/effect'

describe('mini-vue: effect', () => {
  it('should run effect and track dependencies', () => {
    const state = reactive({ count: 1 })
    let dummy = 0

    effect(() => {
      dummy = state.count
    })

    expect(dummy).toBe(1)

    state.count++
    expect(dummy).toBe(2)
  })
})
