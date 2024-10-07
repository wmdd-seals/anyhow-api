import { gql } from 'graphql-tag'

export const guideTypeDef = gql`
    type Guide {
        id: ID!
        title: String!
        description: String!
        body: String!
        quizzes: [Quiz]!
    }

    type Query {
        guide(id: ID!): Guide!
        guides(search: String): [Guide]!
    }

    type Mutation {
        createGuide(input: GuideCreationInput!): Guide!
    }

    input UserInput {
        email: String!
    }

    input GuideCreationInput {
        title: String!
        description: String!
        body: String!
    }
`
