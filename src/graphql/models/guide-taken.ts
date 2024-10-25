import { gql } from 'graphql-tag'

export const guideTakenTypeDef = gql`
    scalar JSON
    type GuideTaken {
        id: ID!
        userId: ID!
        guideId: ID!
        user: User!
        guide: Guide!
    }

    type GuideTakenCounts {
        date: String!
        guideCount: Int!
    }

    type Query {
        guideTaken(id: ID!): GuideTaken!
        guideTakenCounts(userId: ID!): [GuideTakenCounts]!
    }

    type Mutation {
        addGuideTaken(input: GuideTakenCreationInput!): GuideTaken!
    }

    input GuideTakenCreationInput {
        guideId: ID!
    }
`
