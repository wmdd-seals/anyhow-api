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
        findGuideById(id: ID!): Guide!
        searchGuides(text: String): [Guide]!
        findAllGuidesWithUserEmail(email: String): [Guide]!
    }

    type Mutation {
        createGuide(data: GuideCreationInput!): Guide!
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
