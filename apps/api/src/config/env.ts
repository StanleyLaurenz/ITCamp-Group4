import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT) || 3001, // 3001 as fallback port value
  clientOrigin: process.env.CLIENT_ORIGIN!, // guarantees value is not null nor undefined
}