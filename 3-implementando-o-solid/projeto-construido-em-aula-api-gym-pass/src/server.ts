import { app } from './app'
import { env } from './env'

app
  .listen({
    // configuração obrigatória para fazer o deploy
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
