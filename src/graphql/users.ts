
import { gql } from 'graphql-tag';



export const typeDef =gql`
 type Users{
    id : String!
    first_name : String!
    middle_name : String
    last_name : String!
    email : String!
    password : String!
    guides : [Guides!]
 }
    
 type Query{
      findUserByEmail (email : String) : Users!
      findAllGuidesWithUserEmail(email: String) : Users!
 }

 type Mutation {
 
   signupUser(data: UserCreateInput!): Users!
 }

 input UserCreateInput{
    first_name : String!
    middle_name : String
    last_name : String!
    email : String!
    password : String!
 }`;

 


 