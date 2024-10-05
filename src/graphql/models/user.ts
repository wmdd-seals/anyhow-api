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
        user(id: ID!): User!
    }

    type Mutation {
        signupUser(input: UserCreateInput!): User!
    }

    input UserCreateInput {
        firstName: String!
        middleName: String
        lastName: String!
        email: String!
        password: String!
    }
`
