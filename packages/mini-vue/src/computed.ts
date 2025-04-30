import { effect } from './effect'
import { track, trigger } from './effect'

/**
 * 实现响应式计算属性 computed
 * @param getter - 用于计算的函数，通常依赖于响应式数据
 * @returns 一个包含 .value 只读属性的对象
 */
export function computed<T>(getter: () => T): { readonly value: T } {
  let value: T // 缓存的值
  let dirty = true // 脏标记，表示是否需要重新计算

  // computed 返回的对象
  const obj = {
    get value() {
      track(obj, 'value') // 建立依赖关系
      console.info('get value() called', { dirty })
      if (dirty) {
        value = runner() // 懒执行计算逻辑
        dirty = false
      }
      return value
    },
  }

  // 创建一个懒执行的 effect，当依赖项变动时只更新 dirty
  const runner = effect(getter, {
    lazy: true,
    scheduler: () => {
      dirty = true // 下次访问 .value 时重新计算
      trigger(obj, 'value') // 通知依赖更新
    },
  })

  return obj
}
