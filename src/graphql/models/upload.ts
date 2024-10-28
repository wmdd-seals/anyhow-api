import { gql } from 'graphql-tag'

export const uploadTypeDef = gql`
    type File {
        name: String!
        base64Data: String!
        id: ID!
    }

    input FileInfo {
        name: String!
        base64Data: String!
        guideId: String!
    }

    type Query {
        image(id: String): File!
        images(guideId: String): [File!]!
    }

    type Mutation {
        uploadBase64File(input: FileInfo!): File!
    }
`
