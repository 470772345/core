// test/computed.spec.ts
import { reactive } from '../src/reactive'
import { computed } from '../src/computed'
import { effect } from '../src/effect'

describe('mini-vue: computed', () => {
  it('should compute lazily', () => {
    const value = reactive({ count: 1 })
    const getter = vi.fn(() => value.count + 1)
    const c = computed(getter)

    expect(getter).not.toHaveBeenCalled() // 懒执行
    expect(c.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(1)

    // 缓存命中
    c.value
    expect(getter).toHaveBeenCalledTimes(1)

    // 缓存失效，重新执行
    value.count++
    expect(c.value).toBe(3)
    expect(getter).toHaveBeenCalledTimes(2)
  })

  it('should trigger effect when computed is used in effect', () => {
    const value = reactive({ count: 1 })
    const c = computed(() => value.count)

    let dummy
    effect(() => {
      dummy = c.value
    })

    expect(dummy).toBe(1)
    value.count++
    expect(dummy).toBe(2)
  })
})
