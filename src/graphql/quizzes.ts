import { gql } from 'graphql-tag'

export const typeDef = gql`
    type Quizzes {
        id: ID!
        guide: Guides!
        title: String!
        description: String!
        body: String!
    }

    type Query {
        findQuizById(Id: String): Guides
        findQuizWithGuidId(guideId: String): Guides!
    }

    type Mutation {
        createQuiz(data: QuizCreationInput!): Guides!
    }

    input GuideInput {
        id: String!
    }

    input QuizCreationInput {
        title: String!
        description: String!
        body: String!
        guide: GuideInput!
    }
`
