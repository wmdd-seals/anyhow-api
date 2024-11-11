import { gql } from 'graphql-tag'

export const guideViewsTypeDef = gql`
    scalar JSON
    type GuideViews {
        id: ID
        guideId: ID
        userId: ID
        createdAt: String
        guide: Guide
        user: User
    }

    type GuideViewResult {
        guideId: ID
        count: Int
    }

    input GuideViewInput {
        guideId: ID!
    }

    type Query {
        guideViewCount(input: GuideViewInput!): GuideViewResult!
        guideViews: [GuideViews!]!
    }

    type Mutation {
        storeGuideView(input: GuideViewInput!): GuideViews!
    }
`
