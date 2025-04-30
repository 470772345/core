import { reactive } from '../src/reactive'

describe('mini-vue: reactive', () => {
  it('should track set/get', () => {
    const obj = reactive({ count: 0 })
    obj.count++
    expect(obj.count).toBe(1)
  })
})
