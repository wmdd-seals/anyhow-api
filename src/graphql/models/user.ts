import { gql } from 'graphql-tag'

export const userTypeDef = gql`
    type User {
        id: ID!
        firstName: String!
        middleName: String
        lastName: String!
        email: String!
    }

    type Query {
        findUserByEmail(email: String): User!
    }

    type Mutation {
        signupUser(data: UserCreateInput!): User!
    }

    input UserCreateInput {
        firstName: String!
        middleName: String
        lastName: String!
        email: String!
        password: String!
    }
`
