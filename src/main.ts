import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { type Context, prisma } from './context'
import {
    resolvers,
    userTypeDef,
    guideTypeDef,
    quizTypeDef,
    quizanswersTypeDef,
    uploadTypeDef
} from './graphql'
import { verifyToken } from './graphql/auth'
import { OpenAIAPI } from './graphql/datasources'
const server = new ApolloServer({
    typeDefs: [
        userTypeDef,
        guideTypeDef,
        quizTypeDef,
        quizanswersTypeDef,
        uploadTypeDef
    ],
    resolvers,
    includeStacktraceInErrorResponses: false
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000

const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }): Promise<Context> =>
        Promise.resolve({
            prisma,
            currentUserId: verifyToken(req.headers.authorization || ''),
            dataSources: { openAI: new OpenAIAPI() }
        })
})

console.log(`🚀  Server ready at: ${url}`)
