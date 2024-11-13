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

    input GuideViewCountByGuideIdInput {
        guideId: ID!
    }

    input GuideViewCountInDateRangeInput {
        start: String!
        end: String!
    }

    type GuideViewCountInDateRangeInputResult {
        date: String
        count: Int
    }

    type GuideViewCountByGuideIdResult {
        guideId: ID
        count: Int
    }

    type Query {
        guideViewCount(input: GuideViewInput!): GuideViewResult!
        guideViews: [GuideViews!]!
        guideViewCountInDateRange(
            input: GuideViewCountInDateRangeInput!
        ): [GuideViewCountInDateRangeInputResult!]!
        guideViewCountByGuideId(
            input: GuideViewCountByGuideIdInput!
        ): GuideViewCountByGuideIdResult!
    }

    type Mutation {
        storeGuideView(input: GuideViewInput!): GuideViews!
    }
`
