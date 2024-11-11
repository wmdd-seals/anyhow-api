import { gql } from 'graphql-tag'

export const guideTypeDef = gql`
    scalar JSON
    scalar Date

    type Guide {
        id: ID
        title: String
        description: String
        body: String
        liked: Boolean
        rating: Int
        quiz: Quiz
        tags: JSON
        user: User
        createdAt: Date
        updatedAt: Date
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
        removeGuide(input: RemoveGuideInput!): Guide!
        guideChat(input: GuideChatRequest): ChatResponse!
        reviewGuide(input: ReviewGuideInput!): Boolean!
        revokeGuideReview(input: RevokeGuideReviewInput!): Boolean!
    }

    input ReviewGuideInput {
        id: ID!
        liked: Boolean!
    }

    input RemoveGuideInput {
        id: ID!
    }

    input RevokeGuideReviewInput {
        id: ID!
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
