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

    input GenerateQuizInput {
        guideId: ID!
    }

    type Mutation {
        createQuiz(input: QuizCreationInput!): Quiz!
        updateQuiz(input: UpdateQuizInput!): Quiz!
        generateQuiz(input: GenerateQuizInput!): JSON!
    }

    input QuizCreationInput {
        guideId: ID!
        title: String
        description: String
        body: GenreatedQuizInput!
        published: Boolean
    }

    input UpdateQuizInput {
        id: ID!
        title: String
        description: String
        body: GenreatedQuizInput
        published: Boolean
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
        correctAnswerIndex: Int!
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
        correctAnswerIndex: Int!
    }
`
