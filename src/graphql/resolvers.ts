import type { Context } from '../context'
import { Prisma, type Guides, type Quizzes, type Users } from '@prisma/client'
import { generateToken } from './auth'
import { GraphQLError } from 'graphql'
import { jsonScalar } from './scalars'
import type { InputJsonObject } from '@prisma/client/runtime/library'
import type { GenreatedQuiz } from './datasources'

type PromiseMaybe<T> = Promise<T | null>

type MutationInput<T> = {
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

interface UserSingIn {
    token: string
    message: string
}

interface UserSignInInput {
    email: string
    password: string
}

const verifyUser = async (context: Context): Promise<string> => {
    const userId = await context.currentUserId
    console.log(userId)
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
    Guide: {
        quiz: async (
            parent: Guides,
            _args: never,
            context: Context
        ): Promise<PromiseMaybe<Quizzes>> => {
            return context.prisma.quizzes.findUnique({
                where: { guideId: parent.id }
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
        ): Promise<PromiseMaybe<Guides>> {
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
        ): Promise<PromiseMaybe<Guides[]>> {
            return context.prisma.guides.findMany({
                where: {
                    userId: args.userId,
                    body: { search: args.search }
                }
            })
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
        async genrateQuize(
            _: never,
            args: {
                guideId: string
            },
            context: Context
        ): Promise<GenreatedQuiz> {
            console.log(context.currentUserId)
            const userId = await verifyUser(context)
            const guide = await context.prisma.guides.findUnique({
                where: {
                    userId,
                    id: args.guideId
                }
            })
            if (guide) {
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

                return quiz.body as GenreatedQuiz
            }
            return {} as GenreatedQuiz
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
        ): PromiseMaybe<Guides> => {
            const userId = await verifyUser(context)

            return context.prisma.guides.update({
                data: {
                    title: args.input.title,
                    description: args.input.description,
                    body: args.input.body as Prisma.JsonObject,
                    published: args.input.published
                },
                where: {
                    userId,
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
        }
    }
}
