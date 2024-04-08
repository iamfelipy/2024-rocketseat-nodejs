import { app } from "./app";

app.listen({
  // configuração obrigatória para fazer o deploy
  host: '0.0.0.0',
  port: 3333,
}).then(() => {
  console.log('HTTP Server Running!')
})