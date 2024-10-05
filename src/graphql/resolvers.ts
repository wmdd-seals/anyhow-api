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
                include: { quizzes: false },
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
                    user_id: args.userId,
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
                    first_name: args.input.firstName,
                    middle_name: args.input.middleName,
                    last_name: args.input.lastName,
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
