import type { Context } from '../context'
import {
    Prisma,
    type GuideCompleted,
    type Guides,
    type Image,
    type QuizAnswers,
    type Quizzes,
    type Users
} from '@prisma/client'
import { generateToken } from './auth'
import { GraphQLError } from 'graphql'
import { jsonScalar, streamScalar } from './scalars'
import type { InputJsonObject } from '@prisma/client/runtime/library'
import type { GenreatedQuiz } from './datasources'
import type { ChatCompletionMessageParam } from 'openai/resources'

type PromiseMaybe<T> = Promise<T | null>

type MutationInput<T> = {
    input: T
}

type QueryInput<T> = {
    input: T
}

interface UserCreateInput {
    firstName: string
    middleName?: string
    lastName: string
    email: string
    password: string
    favoriteTopics?: InputJsonObject
}

interface UserProfile {
    firstName?: string
    middleName?: string
    lastName?: string
    email?: string
    password?: string
    favoriteTopics?: InputJsonObject
}

interface UserInput {
    email: string
}

interface GuideCreationInput {
    title: string
    description: string
    body: string
    user: UserInput
    tags: InputJsonObject
    published?: boolean
}

interface UpdateGuideInput {
    id: string
    body?: string
    title?: string
    tags?: InputJsonObject
    description?: string
    published?: boolean
}

interface QuizCreationInput {
    guideId: string
    title?: string
    description?: string
    body: GenreatedQuiz
    published?: boolean
}

interface UpdateQuizInput {
    id: string
    title?: string
    description?: string
    body?: GenreatedQuiz
    published?: boolean
}

interface GuideCompletedDateRange {
    start: string
    end: string
}

type GuideCompletedCountsResult = {
    date: string
    count: number
}

interface UserSingIn {
    token: string
    message: string
}

interface UserSignInInput {
    email: string
    password: string
}

interface GenerateQuizInput {
    guideId: string
}

interface SaveQuizAnswersInput {
    quizid: string
    answers: InputJsonObject
    iscompleted: boolean
}

interface GuideChatRequest {
    guideId: string
    prompt: string
}

interface FileInfo {
    name: string
    base64Data: string
    guideId: string
    mimeType: string
}

const verifyUser = async (context: Context): Promise<string> => {
    const userId = await context.currentUserId
    if (!userId || userId === 'Invalid token') {
        throw new GraphQLError(
            'You are not authorized to perform this action.',
            {
                extensions: {
                    code: 'UNAUTHENTICATED'
                }
            }
        )
    }

    return userId
}

export const resolvers = {
    JSON: jsonScalar,
    Stream: streamScalar,
    Guide: {
        quiz: async (
            parent: Guides,
            _args: never,
            context: Context
        ): PromiseMaybe<Quizzes> => {
            return context.prisma.quizzes.findUnique({
                where: { guideId: parent.id }
            })
        },
        user: async (
            parent: Guides,
            _args: never,
            context: Context
        ): PromiseMaybe<Users> => {
            return context.prisma.users.findUnique({
                where: { id: parent.userId }
            })
        }
    },
    Query: {
        async user(
            _: never,
            _args: never,
            context: Context
        ): PromiseMaybe<Users> {
            const userId = await verifyUser(context)

            return context.prisma.users.findUnique({
                where: { id: userId }
            })
        },
        async guide(
            _: never,
            args: { id: string },
            context: Context
        ): PromiseMaybe<Guides> {
            return context.prisma.guides.findUnique({
                where: { id: args.id }
            })
        },
        async guides(
            _: never,
            args: {
                userId?: string
                search?: string
            },
            context: Context
        ): PromiseMaybe<Guides[]> {
            return context.prisma.guides.findMany({
                where: {
                    userId: args.userId,
                    body: { search: args.search }
                }
            })
        },
        async guideCompletedCounts(
            _: never,
            args: QueryInput<GuideCompletedDateRange>,
            context: Context
        ): Promise<GuideCompletedCountsResult[]> {
            const userId = await verifyUser(context)
            console.log(userId, { ...args })
            const completedGuides = await context.prisma.guideCompleted.groupBy(
                {
                    by: ['createdAt', 'userId'],
                    where: {
                        userId: userId,
                        createdAt: {
                            gte: new Date(args.input.start),
                            lte: new Date(args.input.end)
                        }
                    },
                    _count: {
                        _all: true
                    }
                }
            )

            const accumulatedCounts = completedGuides.reduce(
                (acc, record) => {
                    const date = record.createdAt.toISOString().split('T')[0]
                    if (!acc[date]) {
                        acc[date] = 0
                    }
                    acc[date] += record._count._all
                    return acc
                },
                {} as Record<string, number>
            )

            const startDate = new Date(args.input.start)
            const endDate = new Date(args.input.end)
            for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0]
                if (!accumulatedCounts[dateStr]) {
                    accumulatedCounts[dateStr] = 0
                }
            }

            return Object.entries(accumulatedCounts)
                .sort(
                    ([dateA], [dateB]) =>
                        new Date(dateA).getTime() - new Date(dateB).getTime()
                )
                .map(([date, count]) => ({
                    date,
                    count
                }))
        },
        async quizAnswers(
            _: never,
            args: {
                quizId?: string
            },
            context: Context
        ): PromiseMaybe<QuizAnswers[]> {
            const userId = await verifyUser(context)
            return context.prisma.quizAnswers.findMany({
                where: {
                    userId,
                    quizId: args.quizId
                }
            })
        },
        async chathistory(
            _: never,
            args: {
                guideId?: string
            },
            context: Context
        ): PromiseMaybe<ChatCompletionMessageParam[]> {
            const userId = await verifyUser(context)
            const chatHistory = await context.prisma.chatHistory.findUnique({
                where: {
                    userId,
                    guideId: args.guideId
                }
            })

            return JSON.parse(
                JSON.stringify(chatHistory?.message ?? [])
            ) as ChatCompletionMessageParam[]
        },
        async signIn(
            _: never,
            args: MutationInput<UserSignInInput>,
            context: Context
        ): Promise<UserSingIn> {
            const user = await context.prisma.users.findUnique({
                where: {
                    email: args.input.email,
                    password: args.input.password
                }
            })

            if (user) {
                const token = await generateToken({ userid: user.id })
                return {
                    token: token,
                    message: ''
                }
            } else {
                return {
                    token: '',
                    message: 'Invalid email or password'
                }
            }
        },
        async image(
            _: never,
            args: { id: string },
            context: Context
        ): PromiseMaybe<Image> {
            return context.prisma.image.findUnique({
                where: { id: args.id }
            })
        },
        async images(
            _: never,
            args: { guideId: string },
            context: Context
        ): PromiseMaybe<Image[]> {
            return context.prisma.image.findMany({
                where: { guideId: args.guideId }
            })
        }
    },
    Mutation: {
        signupUser: (
            _: never,
            args: MutationInput<UserCreateInput>,
            context: Context
        ): PromiseMaybe<Users> => {
            return context.prisma.users.create({
                data: {
                    firstName: args.input.firstName,
                    middleName: args.input.middleName,
                    lastName: args.input.lastName,
                    email: args.input.email,
                    password: args.input.password
                }
            })
        },
        createGuide: async (
            _: never,
            args: MutationInput<GuideCreationInput>,
            context: Context
        ): PromiseMaybe<Guides> => {
            const userId = await verifyUser(context)

            return context.prisma.guides.create({
                data: {
                    title: args.input.title,
                    description: args.input.description,
                    body: args.input.body,
                    tags: args.input.tags,
                    published: args.input.published,
                    user: {
                        connect: { id: userId }
                    }
                }
            })
        },
        updateGuide: async (
            _: never,
            args: MutationInput<UpdateGuideInput>,
            context: Context
        ): PromiseMaybe<Guides> => {
            const userId = await verifyUser(context)

            return context.prisma.guides.update({
                data: {
                    title: args.input.title,
                    description: args.input.description,
                    body: args.input.body,
                    tags: args.input.tags,
                    published: args.input.published
                },
                where: {
                    userId,
                    id: args.input.id
                }
            })
        },
        createQuiz: async (
            _: never,
            args: MutationInput<QuizCreationInput>,
            context: Context
        ): PromiseMaybe<Quizzes> => {
            await verifyUser(context)
            return context.prisma.quizzes.create({
                data: {
                    title: args.input.title,
                    description: args.input.description,
                    body: args.input.body as Prisma.JsonObject,
                    published: args.input.published,
                    guide: {
                        connect: { id: args.input.guideId }
                    }
                }
            })
        },
        updateQuiz: async (
            _: never,
            args: MutationInput<UpdateQuizInput>,
            context: Context
        ): PromiseMaybe<Quizzes> => {
            // const userId = await verifyUser(context)

            return context.prisma.quizzes.update({
                data: {
                    title: args.input.title,
                    description: args.input.description,
                    body: args.input.body as Prisma.JsonObject,
                    published: args.input.published
                },
                where: {
                    id: args.input.id
                }
            })
        },
        updateUserProfile: async (
            _: never,
            args: MutationInput<UserProfile>,
            context: Context
        ): PromiseMaybe<Users> => {
            const userId = await verifyUser(context)
            return context.prisma.users.update({
                data: {
                    firstName: args.input.firstName,
                    middleName: args.input.middleName,
                    lastName: args.input.lastName,
                    email: args.input.email,
                    password: args.input.password,
                    favoriteTopics: args.input.favoriteTopics
                },
                where: {
                    id: userId
                }
            })
        },
        async generateQuiz(
            _: never,
            args: MutationInput<GenerateQuizInput>,
            context: Context
        ): Promise<Quizzes> {
            const userId = await verifyUser(context)
            const guide = await context.prisma.guides.findUnique({
                where: {
                    userId,
                    id: args.input.guideId
                }
            })

            if (!guide) {
                throw new GraphQLError(
                    'No matching guide found for the given Guide ID',
                    {
                        extensions: {
                            code: 'BAD_USER_INPUT'
                        }
                    }
                )
            }
            const genreatedquiz = await context.dataSources.openAI.chat(
                guide.body
            )
            const quiz = await context.prisma.quizzes.create({
                data: {
                    body: genreatedquiz as Prisma.JsonObject,
                    guide: {
                        connect: { id: guide.id }
                    }
                }
            })

            return quiz
        },
        async saveQuizAnswers(
            _: never,
            args: MutationInput<SaveQuizAnswersInput>,
            context: Context
        ): Promise<QuizAnswers> {
            const userId = await verifyUser(context)

            const quizAnswers = await context.prisma.quizAnswers.findUnique({
                where: {
                    userId_quizId: { userId, quizId: args.input.quizid }
                }
            })

            if (quizAnswers) {
                return context.prisma.quizAnswers.update({
                    data: {
                        answers: args.input.answers,
                        isCompleted: args.input.iscompleted,
                        completionTime: args.input.iscompleted
                            ? new Date()
                            : null
                    },
                    where: {
                        userId_quizId: { userId, quizId: args.input.quizid }
                    }
                })
            } else {
                return context.prisma.quizAnswers.create({
                    data: {
                        answers: args.input.answers,
                        isCompleted: args.input.iscompleted,
                        completionTime: args.input.iscompleted
                            ? new Date()
                            : null,
                        quiz: {
                            connect: { id: args.input.quizid }
                        },
                        user: {
                            connect: { id: userId }
                        }
                    }
                })
            }
        },
        async guideChat(
            _: never,
            args: MutationInput<GuideChatRequest>,
            context: Context
        ): PromiseMaybe<ChatCompletionMessageParam> {
            const userId = await verifyUser(context)

            const guide = await context.prisma.guides.findUnique({
                where: {
                    id: args.input.guideId
                }
            })

            if (!guide) {
                throw new GraphQLError(
                    'No matching guide found for the given Guide ID',
                    {
                        extensions: {
                            code: 'BAD_USER_INPUT'
                        }
                    }
                )
            }

            const chatHistory = await context.prisma.chatHistory.findUnique({
                where: {
                    userId,
                    guideId: args.input.guideId
                }
            })

            const chatmessages = JSON.parse(
                JSON.stringify(chatHistory?.message ?? [])
            ) as ChatCompletionMessageParam[]

            chatmessages.push({
                role: 'user',
                content: args.input.prompt
            })

            if (typeof chatmessages[0].content !== 'string') {
                return null
            }

            chatmessages.unshift({
                role: 'system',
                content: `${guide.body} Assist the user based on this content`
            })
            const response =
                await context.dataSources.openAI.guideChat(chatmessages)

            const responseText =
                response.content ?? response.refusal ?? 'No response'

            const responseObj = {
                role: 'assistant',
                content: responseText
            } as ChatCompletionMessageParam

            chatmessages.push(responseObj)
            chatmessages.shift()
            if (chatHistory) {
                await context.prisma.chatHistory.update({
                    data: {
                        message: chatmessages as unknown as Prisma.JsonObject
                    },
                    where: {
                        userId,
                        id: chatHistory.id
                    }
                })
            } else {
                await context.prisma.chatHistory.create({
                    data: {
                        message: chatmessages as unknown as Prisma.JsonObject,
                        user: {
                            connect: { id: userId }
                        },
                        guide: {
                            connect: { id: args.input.guideId }
                        }
                    }
                })
            }

            return responseObj
        },
        async storeGuideCompleted(
            _: never,
            args: MutationInput<{ guideId: string }>,
            context: Context
        ): PromiseMaybe<GuideCompleted> {
            const userId = await verifyUser(context)

            return context.prisma.guideCompleted.create({
                data: {
                    userId,
                    guideId: args.input.guideId
                }
            })
        },
        async uploadImage(
            _: never,
            args: MutationInput<FileInfo>,
            context: Context
        ): PromiseMaybe<Image> {
            await verifyUser(context)

            return context.prisma.image.create({
                data: {
                    base64Data: args.input.base64Data,
                    mimeType: args.input.mimeType,
                    name: args.input.name,
                    guide: {
                        connect: { id: args.input.guideId }
                    }
                }
            })
        },
        async uploadCoverImage(
            _: never,
            args: MutationInput<FileInfo>,
            context: Context
        ): PromiseMaybe<Image> {
            await verifyUser(context)

            return context.prisma.image.create({
                data: {
                    id: args.input.guideId,
                    base64Data: args.input.base64Data,
                    mimeType: args.input.mimeType,
                    name: args.input.name,
                    guide: {
                        connect: { id: args.input.guideId }
                    }
                }
            })
        },
        async removeImage(
            _: never,
            args: { id: string },
            context: Context
        ): Promise<boolean> {
            await verifyUser(context)
            await context.prisma.image.delete({
                where: {
                    id: args.id
                }
            })

            return true
        }
    }
}
