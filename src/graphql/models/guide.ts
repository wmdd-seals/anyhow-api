import { gql } from 'graphql-tag'

export const guideTypeDef = gql`
    scalar JSON
    type Guide {
        id: ID
        title: String
        description: String
        body: String
        liked: Boolean
        quiz: Quiz
        tags: JSON
        user: User
    }

    type ChatResponse {
        role: String
        content: String
    }
    type Query {
        guide(id: ID!): Guide
        guides(userId: ID, search: String): [Guide]
        chathistory(guideId: String!): [ChatResponse!]!
    }

    type Mutation {
        createGuide(input: GuideCreationInput!): Guide!
        updateGuide(input: UpdateGuideInput!): Guide!
        guideChat(input: GuideChatRequest): ChatResponse!
    }

    input GuideChatRequest {
        guideId: String!
        prompt: String!
    }

    input UserInput {
        email: String!
    }

    input GuideCreationInput {
        title: String!
        description: String!
        body: String!
        tags: JSON!
        published: Boolean
    }

    input UpdateGuideInput {
        id: ID!
        title: String
        description: String
        body: String
        tags: JSON
        published: Boolean
    }
`
