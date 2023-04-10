export const use = <A, B>(a: A, cb: (a: A) => B): B => cb(a)
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

export const callEndpoint =
  (api: Traversable<Function>) => (path: string[], args: any[], context: any) =>
    use(traverse(api, path), (endpoint) =>
      endpoint
        ? asyncCall(() => endpoint.apply(context, args)).then(
            (ok) => ({ ok }),
            (err) => ({ error: err.toString() })
          )
        : Promise.resolve({ error: 'Endpoint not found' })
    )

export function proxyObjectCall<T>(
  cb: (path: string[], args: any[], context: any) => any
): T {
  const proxy = (path: string[]): T =>
    new Proxy(() => {}, {
      get: (_target, prop: string) => proxy([...path, prop]),
      apply: (_, _this, args) => {
        let context = _this
        const lastIndex = path.length - 1
        const last = path[lastIndex]

        if (last === 'call') {
          path = path.slice(0, lastIndex)
          context = args.shift()
        } else if (last === 'apply') {
          path = path.slice(0, lastIndex)
          context = args[0]
          args = args[1]
        }
        return cb.call(context, path, args, context)
      },
    }) as unknown as T

  return proxy([])
}
