import { track, trigger } from './effect'
export function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, key, receiver) {
      console.info('[GET]', key)
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      console.info('[SET]', key, value)
      trigger(target, key)
      return Reflect.set(target, key, value, receiver)
    },
  })
}
