import type { Context } from '../context'
import { type Guides, type Quizzes, type Users } from '@prisma/client'

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

export const resolvers = {
    Guide: {
        quizzes: (
            parent: Guides,
            _args: never,
            context: Context
        ): PromiseMaybe<Quizzes[]> => {
            return context.prisma.quizzes.findMany({
                where: { guideId: parent.id }
            })
        }
    },
    Query: {
        user: (
            _: never,
            args: { id: string },
            context: Context
        ): PromiseMaybe<Users> => {
            return context.prisma.users.findUnique({
                where: { id: args.id }
            })
        },
        guide(
            _: never,
            args: { id: string },
            context: Context
        ): PromiseMaybe<Guides> {
            return context.prisma.guides.findUnique({
                where: { id: args.id }
            })
        },
        guides(
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
        createGuide: (
            _: never,
            args: MutationInput<GuideCreationInput>,
            context: Context
        ): PromiseMaybe<Guides> => {
            return context.prisma.guides.create({
                data: {
                    title: args.input.title,
                    description: args.input.description,
                    body: args.input.body,
                    user: {
                        connect: { email: args.input.user.email }
                    }
                }
            })
        },
        createQuiz: (
            _: never,
            args: MutationInput<QuizCreationInput>,
            context: Context
        ): PromiseMaybe<Quizzes> => {
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
        }
    }
}
