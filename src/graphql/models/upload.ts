import { gql } from 'graphql-tag'

export const uploadTypeDef = gql`
    scalar Stream
    type File {
        name: String
        base64Data: Stream
        id: ID
        mimeType: String
    }

    input FileInfo {
        name: String!
        base64Data: String!
        guideId: String!
        mimeType: String!
    }

    type Query {
        image(id: String): File!
        images(guideId: String): [File!]!
    }

    type Mutation {
        uploadBase64File(input: FileInfo!): File!
    }
`
