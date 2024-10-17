import type { Context } from '../context'
import { type Guides, type Quizzes, type Users } from '@prisma/client'
import { generateToken } from './auth'
import { GraphQLError } from 'graphql'
import { jsonScalar } from './scalars'
import type { InputJsonObject } from '@prisma/client/runtime/library'

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

interface GuideInput {
    id: string
}

interface GuideCreationInput {
    title: string
    description: string
    body: string
    user: UserInput
    tags: InputJsonObject
}

interface UpdateGuideInput {
    id: string
    body?: string
    title?: string
    tags?: InputJsonObject
    description?: string
}

interface QuizCreationInput {
    guide: GuideInput
    title: string
    description: string
    body: InputJsonObject
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

    if (!userId) {
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
        quizzes: async (
            parent: Guides,
            _args: never,
            context: Context
        ): Promise<PromiseMaybe<Quizzes[]>> => {
            return context.prisma.quizzes.findMany({
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
        async genrateQuizeWithOpenAI(
            _: never,
            args: MutationInput<string>,
            context: Context
        ): Promise<unknown> {
            await verifyUser(context)
            return context.dataSources.openAI.chat(args.input)
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
                    tags: args.input.tags
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
                    body: args.input.body,
                    guide: {
                        connect: { id: args.input.guide.id }
                    }
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
                    favoriteTopics: args.input.favoriteTopics,
                    updated_ts: new Date()
                },
                where: {
                    id: userId
                }
            })
        }
    }
}
