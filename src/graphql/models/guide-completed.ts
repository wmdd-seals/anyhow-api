import { gql } from 'graphql-tag'

export const guideCompletedTypeDef = gql`
    scalar JSON
    type GuideCompleted {
        id: ID
        guideId: ID
        userId: ID
        createdAt: String
        guide: Guide
        user: User
    }

    type GuideCompletedCountsResult {
        date: String
        count: Int
    }

    input StoreGuideCompletedInput {
        guideId: ID!
    }

    type Query {
        guideCompletedCounts(
            input: GuideCompletedDateRange
        ): [GuideCompletedCountsResult!]!
        guideCompletedList: [GuideCompleted!]!
    }

    type Mutation {
        storeGuideCompleted(input: StoreGuideCompletedInput!): GuideCompleted!
    }

    input GuideCompletedDateRange {
        start: String
        end: String
    }
`
