import type { Context } from '../context'
import { type Guides, type Quizzes, type Users } from '@prisma/client'
import { generateToken } from './auth/jwt'

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
}

interface QuizCreationInput {
    guide: GuideInput
    title: string
    description: string
    body: string
}

interface UserSingIn {
    token: string
    message: string
}

interface UserSignInInput {
    email: string
    password: string
}

export const resolvers = {
    Guide: {
        quizzes: async (
            parent: Guides,
            _args: never,
            context: Context
        ): Promise<PromiseMaybe<Quizzes[]>> => {
            const userId = await context.currentUserId

            if (!userId) return null

            return context.prisma.quizzes.findMany({
                where: { guideId: parent.id, userId: userId }
            })
        }
    },
    Query: {
        async user(
            _: never,
            _args: never,
            context: Context
        ): PromiseMaybe<Users> {
            const userId = await context.currentUserId

            if (!userId) return null

            return context.prisma.users.findUnique({
                where: { id: userId }
            })
        },
        async guide(
            _: never,
            args: { id: string },
            context: Context
        ): Promise<PromiseMaybe<Guides>> {
            const userId = await context.currentUserId

            if (!userId) return null
            return context.prisma.guides.findUnique({
                where: { id: args.id }
            })
        },
        async guides(
            _: never,
            args: {
                search?: string
            },
            context: Context
        ): Promise<PromiseMaybe<Guides[]>> {
            const userId = await context.currentUserId

            if (!userId) return null

            return context.prisma.guides.findMany({
                where: {
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
            const userId = await context.currentUserId

            if (!userId) return null

            return context.prisma.guides.create({
                data: {
                    title: args.input.title,
                    description: args.input.description,
                    body: args.input.body,
                    user: {
                        connect: { id: userId }
                    }
                }
            })
        },
        createQuiz: async (
            _: never,
            args: MutationInput<QuizCreationInput>,
            context: Context
        ): PromiseMaybe<Quizzes> => {
            const userId = await context.currentUserId

            if (!userId) return null

            return context.prisma.quizzes.create({
                data: {
                    title: args.input.title,
                    description: args.input.description,
                    body: args.input.body,
                    guide: {
                        connect: { id: args.input.guide.id }
                    },
                    user: {
                        connect: { id: userId }
                    }
                }
            })
        }
    }
}
