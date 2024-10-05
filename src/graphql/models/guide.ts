import { gql } from 'graphql-tag'

export const guideTypeDef = gql`
    type Guide {
        id: ID!
        title: String!
        description: String!
        body: String!
        quiz: Quiz!
        user: User!
    }

    type Query {
        guide(id: ID!): Guide!
        guides(userId: ID, search: String): [Guide]!
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
        user: UserInput!
    }
`
