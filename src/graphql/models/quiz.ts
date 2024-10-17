import { gql } from 'graphql-tag'

export const quizTypeDef = gql`
    scalar JSON
    type Quiz {
        id: ID!
        guide: Guide
        title: String
        description: String
        body: GenreatedQuiz
    }

    type Query {
        genrateQuizeWithOpenAI(input: String!): GenreatedQuiz!
    }

    type Mutation {
        createQuiz(input: QuizCreationInput!): Quiz!
    }

    input QuizCreationInput {
        guideId: ID!
        title: String!
        description: String!
        body: GenreatedQuizInput!
    }

    input GenreatedQuizInput {
        quiz: QuizInput
    }

    input QuizInput {
        title: String
        questions: [QuestionInput]
    }

    input QuestionInput {
        question: String!
        options: [String]!
        answer: String!
    }

    type GenreatedQuiz {
        quiz: QuizObject
    }

    type QuizObject {
        title: String
        questions: [Question]
    }

    type Question {
        question: String!
        options: [String]!
        answer: String!
    }
`
