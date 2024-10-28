import { gql } from 'graphql-tag'

export const quizanswersTypeDef = gql`
    scalar JSON
    type QuizAnswers {
        id: ID
        quiz: Quiz
        answers: JSON
        user: User
        iscompleted: Boolean
    }

    input SaveQuizAnswersInput {
        quizid: ID!
        answers: JSON!
        iscompleted: Boolean
    }

    type Query {
        quizAnswers(quizId: String): [QuizAnswers]!
    }

    type Mutation {
        saveQuizAnswers(input: SaveQuizAnswersInput): QuizAnswers!
    }
`
