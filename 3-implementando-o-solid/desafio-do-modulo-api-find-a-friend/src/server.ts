import { app } from './app'

app
  .listen({
    // configuração obrigatória para fazer o deploy
    port: 3000,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
