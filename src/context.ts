import { PrismaClient } from '@prisma/client'

export interface Context {
    prisma: PrismaClient
    currentUserId?: string
}

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
})

export const createContext = (): Promise<Context> => Promise.resolve({ prisma })
