import { callEndpoint, proxyObjectCall } from './lib/index'

const api = {
  service: {
    async endpoint(a: string, b: string) {
      console.log('endpoint', { this: this, a, b })
      return { a, b }
    },
    arrowFun: (param: string) => {
      console.log({ this: this, param })
      return param
    },
  },
}

const callApiEndpoint = callEndpoint(api)

// api.service.endpoint('xyz') /*?*/
// api.service.arrowFun('xyz') /*?*/

const apiProxy = proxyObjectCall<typeof api>(function (
  this: any,
  path,
  args,
  context
) {
  console.log({ path, args, this: this, context })
  return callApiEndpoint(path, args, context)
})

apiProxy.service.endpoint('arg1', 'arg3')
// api.service.endpoint.call('THIS', 'xyz', '123') /*?*/
// apiProxy.service.endpoint.apply('THIS', ['xyz', '1231']) /*?*/
