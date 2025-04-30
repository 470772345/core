// __tests__/ref.spec.ts
import { ref } from '../src/ref'
import { effect } from '../src/effect'

describe('mini-vue: ref', () => {
  it('should hold a value', () => {
    const count = ref(1)
    expect(count.value).toBe(1)
  })

  it('should be reactive', () => {
    const count = ref(1)
    let dummy

    effect(() => {
      dummy = count.value
    })

    expect(dummy).toBe(1)

    count.value = 2
    expect(dummy).toBe(2)
  })

  it('should not trigger effect if set same value', () => {
    const count = ref(1)
    let dummy = 0
    let calls = 0

    effect(() => {
      calls++
      dummy = count.value
    })

    expect(calls).toBe(1)
    count.value = 1 // 不变，不触发
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
  })
})
