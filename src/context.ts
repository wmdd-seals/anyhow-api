import { PrismaClient } from '@prisma/client'
import type { OpenAIAPI } from './graphql/datasources'

interface openAI {
    openAI: OpenAIAPI
}

export interface Context {
    prisma: PrismaClient
    currentUserId?: Promise<string>
    dataSources: openAI
}

export const prisma = new PrismaClient({
    //log: ['query', 'info', 'warn', 'error']
})

//export const createContext = (): Promise<Context> => Promise.resolve({ prisma })
