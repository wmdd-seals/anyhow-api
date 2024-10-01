import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';


import { Context, createContext } from './context.js'

import {typeDef as Users} from './graphql/users.js'
import {typeDef as Guides} from './graphql/guides.js'
import {typeDef as Quizzes} from './graphql/quizzes.js'
import {resolvers} from './graphql/resolvers.js'






const server = new ApolloServer<Context>({
    typeDefs : [Users,Guides,Quizzes],
    resolvers :  resolvers
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    context: createContext,
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);