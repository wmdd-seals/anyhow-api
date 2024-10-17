import { gql } from 'graphql-tag'

export const guideTypeDef = gql`
    scalar JSON
    type Guide {
        id: ID!
        title: String!
        description: String!
        body: String!
        quizzes: Quiz!
        tags: JSON!
        user: User!
    }

    type Query {
        guide(id: ID!): Guide!
        guides(userId: ID, search: String): [Guide]!
    }

    type Mutation {
        createGuide(input: GuideCreationInput!): Guide!
        updateGuide(input: UpdateGuideInput!): Guide!
    }

    input UserInput {
        email: String!
    }

    input GuideCreationInput {
        title: String!
        description: String!
        body: String!
        tags: JSON!
    }

    input UpdateGuideInput {
        id: ID!
        title: String
        description: String
        body: String
        tags: JSON
    }
`
