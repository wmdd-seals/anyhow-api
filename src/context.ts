import { PrismaClient } from '@prisma/client'

export interface Context {
    prisma: PrismaClient
    currentUserId?: Promise<string>
}

export const prisma = new PrismaClient({
    //log: ['query', 'info', 'warn', 'error']
})

//export const createContext = (): Promise<Context> => Promise.resolve({ prisma })
