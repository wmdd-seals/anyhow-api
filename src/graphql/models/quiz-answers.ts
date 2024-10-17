import { gql } from 'graphql-tag'

export const quizanswersTypeDef = gql`
    scalar JSON
    type QuizAnswers {
        id: ID!
        quiz: Quiz!
        answers: JSON!
        user: User!
    }

    input SaveQuizAnswersInput {
        quizid: ID!
        answers: JSON!
    }

    type Query {
        QuizAnswers(quizId: String): [QuizAnswers]!
    }

    type Mutation {
        saveQuizAnswers(input: SaveQuizAnswersInput): QuizAnswers!
    }
`
