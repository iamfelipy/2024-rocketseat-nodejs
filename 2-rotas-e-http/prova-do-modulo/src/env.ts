import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
  DEVELOPMENT: z
    .enum(['delopment', 'production', 'test'])
    .default('production'),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('⚠️ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
