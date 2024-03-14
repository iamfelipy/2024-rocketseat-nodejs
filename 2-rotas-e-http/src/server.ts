import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
    // config para funcionar o deploy render
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
