import { gql } from 'graphql-tag'

export const quizTypeDef = gql`
    type Quiz {
        id: ID!
        guide: Guide!
        title: String!
        description: String!
        body: String!
    }

    type Query {
        findQuizById(id: ID!): Guide
        findQuizWithGuideId(guideId: ID!): Guide!
    }

    type Mutation {
        createQuiz(data: QuizCreationInput!): Guide!
    }

    input QuizCreationInput {
        guideId: ID!
        title: String!
        description: String!
        body: String!
    }
`
