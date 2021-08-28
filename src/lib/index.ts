export const use = <A, B>(a: A, cb: (a: A) => B): B => cb(a)
export const noop = (..._args: any[]) => {}
export const asyncCall = async (f: Function) => f()

interface Traversable<T> {
  [key: string]: T | Traversable<T>
}
export const traverse = (
  obj: Traversable<Function>,
  path: string[]
): Function | undefined =>
  use(obj[path[0]], (next) =>
    path.length > 1
      ? traverse(next as Traversable<Function>, path.slice(1))
      : (next as Function)
  )

export function proxyObjectCall<T>(
  call: (path: string[], args: any[]) => any
): T {
  const proxy = (path: Array<string>): T =>
    new Proxy(() => {}, {
      get: (_target, prop: string) => proxy([...path, prop]),
      apply: (_, _this, args) => call(path, args),
    }) as unknown as T

  return proxy([])
}
