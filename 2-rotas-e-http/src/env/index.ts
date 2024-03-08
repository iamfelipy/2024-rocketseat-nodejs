import 'dotenv/config'
import { z } from 'zod'

// process.env

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  // pode ser null -> nullable
  // DATABASE_URL: z.string().nullable()
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

// dipara um error throw caso não passe na validação
// é possivel personalizar a mensagem de erro
// nesse exemplo a mensagem de erro ao executar está muito confusa
// export const env = envSchema.parse(process.env)

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variable!', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
