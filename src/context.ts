import { PrismaClient } from '@prisma/client'
import type { OpenAIAPI } from './graphql/datasources'
import type { BaseContext } from '@apollo/server'

interface openAI {
    openAI: OpenAIAPI
}

export interface Context extends BaseContext {
    prisma: PrismaClient
    currentUserId?: string
    dataSources: openAI
}

export const prisma = new PrismaClient({
    //log: ['query', 'info', 'warn', 'error']
})

//export const createContext = (): Promise<Context> => Promise.resolve({ prisma })
