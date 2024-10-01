
import { gql } from 'graphql-tag';



export const typeDef =gql`
 type Users{
    id : String!
    firstName : String!
    middleName : String
    lastName : String!
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
    firstName : String!
    middleName : String
    lastName : String!
    email : String!
    password : String!
 }`;

 


 