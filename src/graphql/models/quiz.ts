import { gql } from 'graphql-tag'

export const quizTypeDef = gql`
    type Quiz {
        id: ID!
        guide: Guide!
        title: String!
        description: String!
        body: String!
    }

    type Mutation {
        createQuiz(input: QuizCreationInput!): Guide!
    }

    input QuizCreationInput {
        guideId: ID!
        title: String!
        description: String!
        body: String!
    }
`
