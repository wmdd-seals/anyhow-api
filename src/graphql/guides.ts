import { gql } from 'graphql-tag'

export const typeDef = gql`
    type Guides {
        id: ID!
        title: String!
        description: String!
        body: String!
        quiz: Quizzes!
        user: Users!
    }

    type Query {
        findGuideById(Id: String): Guides!
        searchGuides(text: String): [Guides]!
    }

    type Mutation {
        createGuide(data: GuideCreationInput!): Guides!
    }

    input UserInput {
        email: String!
    }
    input GuideCreationInput {
        title: String!
        description: String!
        body: String!
        user: UserInput!
    }
`
