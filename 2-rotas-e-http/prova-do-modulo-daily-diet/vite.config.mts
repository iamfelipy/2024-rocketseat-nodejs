import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    reporters: 'verbose',

    // this fix the conflict between tests switches and the single database
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
})
