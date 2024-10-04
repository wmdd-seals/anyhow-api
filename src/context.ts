import { PrismaClient } from '@prisma/client'

export interface Context {
    prisma: PrismaClient
    currentUserId?: string
}

const prisma = new PrismaClient()

export const createContext = (): Promise<Context> => Promise.resolve({ prisma })
