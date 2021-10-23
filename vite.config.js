// vite.config.js

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: new URL('src/lib/index.ts', import.meta.url).pathname,

      name: 'object-call-utils',
    },
  },
})
