// src/effect.ts
let activeEffect: (() => void) | null = null

const targetMap = new WeakMap<object, Map<string | symbol, Set<() => void>>>()

export function effect(fn: () => void) {
  activeEffect = fn
  console.info('[effect] run effect')
  fn() // 执行一次以建立依赖
  activeEffect = null
}

export function track(target: object, key: string | symbol) {
  if (!activeEffect) return
  console.info(`[track] tracking ${String(key)}`)
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

export function trigger(target: object, key: string | symbol) {
  console.info(`[trigger] triggered by ${String(key)}`)
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effectFn => effectFn())
  }
}
