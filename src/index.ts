import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { type Context, createContext } from './context'
import { resolvers, userTypeDef, guideTypeDef, quizTypeDef } from './graphql'

const server = new ApolloServer<Context>({
    typeDefs: [userTypeDef, guideTypeDef, quizTypeDef],
    resolvers
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000

const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: createContext
})

console.log(`🚀  Server ready at: ${url}`)
