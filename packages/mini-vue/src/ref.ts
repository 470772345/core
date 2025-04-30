// src/ref.ts
import { track, trigger } from './effect'

class RefImpl<T> {
  private _value: T
  private _rawValue: T
  public readonly __v_isRef = true

  constructor(value: T) {
    this._rawValue = value
    this._value = value
  }

  get value() {
    track(this, 'value') // 依赖收集
    return this._value
  }

  set value(newValue: T) {
    if (newValue !== this._rawValue) {
      this._rawValue = newValue
      this._value = newValue
      trigger(this, 'value') // 派发更新
    }
  }
}

/**
 * 判断对象是否为 ref
 */
export function isRef(r: any): boolean {
  return !!(r && r.__v_isRef === true)
}

/**
 * 自动解包 ref
 */
export function unref<T>(r: T | { value: T }): T {
  return isRef(r) ? (r as any).value : r
}

/**
 * 将 reactive 对象的属性转为 ref
 */
export function toRef<T extends object, K extends keyof T>(
  obj: T,
  key: K,
): any {
  return {
    get value() {
      return obj[key]
    },
    set value(val) {
      obj[key] = val
    },
    __v_isRef: true,
  }
}

/**
 * 将 reactive 对象的所有属性转为 ref
 */
export function toRefs<T extends object>(
  obj: T,
): { [K in keyof T]: { value: T[K] } } {
  const ret: any = {}
  for (const key in obj) {
    ret[key] = toRef(obj, key)
  }
  return ret
}

/**
 * 创建响应式 Ref 对象
 * @param value 初始值
 * @returns Ref 包装对象，含 .value 属性
 */
export function ref<T>(value: T): { value: T } {
  return new RefImpl(value)
}
