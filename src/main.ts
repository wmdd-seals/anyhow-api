import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { type Context, prisma } from './context'
import { resolvers, userTypeDef, guideTypeDef, quizTypeDef } from './graphql'
import { verifyToken } from './graphql/auth/jwt'

const server = new ApolloServer<Context>({
    typeDefs: [userTypeDef, guideTypeDef, quizTypeDef],
    resolvers
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000

const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }): Promise<Context> =>
        Promise.resolve({
            prisma,
            currentUserId: verifyToken(req.headers.authorization || '')
        })
})

console.log(`🚀  Server ready at: ${url}`)
