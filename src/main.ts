import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
import { type Context, prisma } from './context'
import {
    resolvers,
    userTypeDef,
    guideTypeDef,
    quizTypeDef,
    quizanswersTypeDef,
    guideCompletedTypeDef,
    uploadTypeDef,
    guideViewsTypeDef
} from './graphql'
import { verifyToken } from './graphql/auth'
import { OpenAIAPI } from './graphql/datasources'
import cors from 'cors'
import http from 'http'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer<Context>({
    typeDefs: [
        userTypeDef,
        guideTypeDef,
        quizTypeDef,
        quizanswersTypeDef,
        guideCompletedTypeDef,
        uploadTypeDef,
        guideViewsTypeDef
    ],
    resolvers,
    includeStacktraceInErrorResponses: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start()

app.get('/images/:id', async (req, res) => {
    try {
        const image = await prisma.image.findUnique({
            where: {
                id: req.params.id
            }
        })
        if (image) {
            const base64Data = image.base64Data.replace(/^data:.+;base64,/, '')
            res.setHeader('Content-Type', image.mimeType)
            res.send(Buffer.from(base64Data, 'base64'))
        } else {
            res.status(404).send('Image not found')
        }
    } catch (e) {
        console.log(e)
        res.send(500).send('Internal Server Error')
    }
})

app.use(
    '/',
    cors({
        methods: ['GET'],
        origin: '*'
    }),
    express.json({ limit: '10mb' }),
    expressMiddleware(server, {
        context: async ({ req }): Promise<Context> =>
            Promise.resolve({
                prisma,
                currentUserId: await verifyToken(
                    req.headers.authorization || ''
                ),
                dataSources: { openAI: new OpenAIAPI() }
            })
    })
)

await new Promise<void>(resolve => httpServer.listen(port, resolve))
console.log(`🚀 Server ready at http://localhost:4000/`)

// Shut down connection on server shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
})
process.on('SIGTERM', async () => {
    await prisma.$disconnect()
    process.exit(0)
})
