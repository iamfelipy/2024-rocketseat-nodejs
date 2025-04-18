// import 'dotenv/config' cexecuta tudo dentro do arquivo config
import { config } from 'dotenv'
import { z } from 'zod'

// process.env: { NODE_ENV: 'dev', ... }

config()

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variable', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
