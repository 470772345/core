// src/effect.ts
type EffectFn = (() => void) & { scheduler?: () => void }
interface EffectOptions {
  lazy?: boolean
  scheduler?: () => void
}
let activeEffect: EffectFn | null = null

const targetMap = new WeakMap<object, Map<string | symbol, Set<EffectFn>>>()

export function effect(fn: () => void, options: EffectOptions = {}): any {
  const effectFn: EffectFn & { scheduler?: () => void } = () => {
    activeEffect = effectFn
    const result = fn()
    activeEffect = null
    return result
  }
  console.info('[effect] run effect')

  if (options.scheduler) {
    effectFn.scheduler = options.scheduler
  }
  console.info(options.scheduler)

  if (!options.lazy) {
    effectFn()
  }

  return effectFn
}

export function track(target: object, key: string | symbol): void {
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

export function trigger(target: object, key: string | symbol): void {
  console.info(`[trigger] triggered by ${String(key)}`)
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  if (!depsMap) return

  const dep = depsMap.get(key)
  console.info('dep-->', dep)
  if (!dep) return

  for (const effectFn of dep) {
    if (effectFn.scheduler) {
      effectFn.scheduler()
    } else {
      effectFn()
    }
  }
}
