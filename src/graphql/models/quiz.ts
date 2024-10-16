import { gql } from 'graphql-tag'

export const quizTypeDef = gql`
    scalar JSON
    type Quiz {
        id: ID!
        guide: Guide!
        title: String!
        description: String!
        body: JSON!
    }

    type Query {
        genrateQuizeWithOpenAI(input: String!): JSON!
    }

    type Mutation {
        createQuiz(input: QuizCreationInput!): Guide!
    }

    input QuizCreationInput {
        guideId: ID!
        title: String!
        description: JSON!
        body: JSON!
    }
`
