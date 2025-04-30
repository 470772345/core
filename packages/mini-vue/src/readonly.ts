// readonly.ts

/**
 * 创建只读响应式对象
 * @param target 原始对象
 * @returns 只读的 Proxy 对象
 */
export function readonly<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, key, receiver) {
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      console.warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
      )
      return true // 阻止修改
    },
    deleteProperty(target, key) {
      console.warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
      )
      return true // 阻止删除
    },
  })
}
