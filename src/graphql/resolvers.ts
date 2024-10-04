import type { Context } from '../context'
import { type Guides, type Quizzes, type Users } from '@prisma/client'

type PromiseMaybe<T> = Promise<T | null>

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
        findUserByEmail: (
            _: never,
            args: { email: string },
            context: Context
        ): PromiseMaybe<Users> => {
            return context.prisma.users.findUnique({
                where: { email: args.email }
            })
        },
        findGuideById: (
            _: never,
            args: { id: string },
            context: Context
        ): PromiseMaybe<Guides> => {
            return context.prisma.guides.findUnique({
                include: { quzzies: false },
                where: { id: args.id }
            })
        },
        findQuizById: (
            _: never,
            args: { id: string },
            context: Context
        ): PromiseMaybe<Quizzes> => {
            return context.prisma.quizzes.findUnique({
                where: { id: args.id }
            })
        },
        findQuizWithGuideId: (
            _: never,
            args: { guideId: string },
            context: Context
        ): PromiseMaybe<Quizzes> => {
            return context.prisma.quizzes.findUnique({
                where: { guide_id: args.guideId }
            })
        },
        searchGuides: (
            _: never,
            args: { text: string },
            context: Context
        ): PromiseMaybe<Guides[]> => {
            return context.prisma.guides.findMany({
                include: {
                    quzzies: false
                },
                where: {
                    body: {
                        search: args.text
                    }
                }
            })
        },
        findAllGuidesWithUserEmail: (
            _: never,
            args: { id: string },
            context: Context
        ): PromiseMaybe<Guides[]> => {
            return context.prisma.guides.findMany({
                relationLoadStrategy: 'join',
                include: {
                    quzzies: false
                },
                where: { user_id: args.id }
            })
        }
    },
    Mutation: {
        signupUser: (
            _: never,
            args: { data: UserCreateInput },
            context: Context
        ): PromiseMaybe<Users> => {
            return context.prisma.users.create({
                data: {
                    first_name: args.data.firstName,
                    middle_name: args.data.middleName,
                    last_name: args.data.lastName,
                    email: args.data.email,
                    password: args.data.password
                }
            })
        },

        createGuide: (
            _: never,
            args: { data: GuideCreationInput },
            context: Context
        ): PromiseMaybe<Guides> => {
            return context.prisma.guides.create({
                data: {
                    title: args.data.title,
                    description: args.data.description,
                    body: args.data.body,
                    user: {
                        connect: { email: args.data.user.email }
                    }
                }
            })
        },
        createQuiz: (
            _: never,
            args: { data: QuizCreationInput },
            context: Context
        ): PromiseMaybe<Quizzes> => {
            return context.prisma.quizzes.create({
                data: {
                    title: args.data.title,
                    description: args.data.description,
                    body: args.data.body,
                    guide: {
                        connect: { id: args.data.guide.id }
                    }
                }
            })
        }
    }
}
