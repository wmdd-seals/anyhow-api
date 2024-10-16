import { gql } from 'graphql-tag'

export const userTypeDef = gql`
    scalar JSON
    type User {
        id: ID!
        firstName: String!
        middleName: String
        lastName: String!
        email: String!
        favoriteTopics: JSON
    }

    type UserSingIn {
        token: String!
        message: String!
    }

    type Query {
        user: User!
        signIn(input: UserSignInInput): UserSingIn!
    }

    type Mutation {
        signupUser(input: UserCreateInput!): User!
        updateUserProfile(input: UserProfile): User!
    }

    input UserSignInInput {
        email: String!
        password: String!
    }

    input UserCreateInput {
        firstName: String!
        middleName: String
        lastName: String!
        email: String!
        password: String!
    }

    input UserProfile {
        firstName: String
        middleName: String
        lastName: String
        email: String
        password: String
        favoriteTopics: JSON
    }
`
