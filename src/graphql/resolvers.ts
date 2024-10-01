import { Context } from '../context.js'

interface UserCreateInput {
    first_name: string
    middle_name?: string
    last_name: string
    email: string
    password: string
    
}

interface UserInput{
    email: string
}

interface GuideInput{
    id: string
}

interface GuideCreationInput{
    title : string
    description : string
    body : string
    user : UserInput
}

interface QuizCreationInput{
    guide : GuideInput
    title : string
    description : string
    body : string
}

export const resolvers = {

    Query: {
       findUserByEmail: (_parent, args: { email: string }, context:Context) =>{
          return context.prisma.users.findUnique({
             where: {email : args.email}
          });
       },
       findGuideById : (_parent, args: { id: string }, context:Context) => {
            return context.prisma.guides.findUnique({
                include:{
                    quzzies:false,
                },
                where: {id : args.id}
            });
       },
       findQuizById : (_parent, args: { id: string }, context:Context) => {
            return context.prisma.quizzes.findUnique({
                where: {id : args.id}
            });
       },
       findQuizWithGuidId: (_parent, args: { guide_id: string }, context:Context) =>{
            return context.prisma.quizzes.findUnique({
                where: {guide_id : args.guide_id}
            });
       },
       searchGuides: (_parent, args: { text: string }, context:Context) =>{
            return context.prisma.guides.findMany({
                include:{
                    quzzies:false,
                },
                where:{
                    body:{
                        search: args.text
                    }
                }
            });
       },
       findAllGuidesWithUserEmail:(_parent, args: { email: string }, context:Context) =>{
            return context.prisma.users.findUnique({
                relationLoadStrategy: 'join',
                include:{
                    guides:{
                        include:{
                            quzzies:false,
                        }
                    },
                },
                where: {email : args.email}
            });
       }
    },
    Mutation: {
       signupUser: (_parent,args: { data: UserCreateInput },context:Context) => {
             return context.prisma.users.create({
                data : {
                   first_name: args.data.first_name,
                   middle_name: args.data.middle_name,
                   last_name: args.data.last_name,
                   email: args.data.email,
                   password: args.data.password
                },
             });
        },

        createGuide: (_parent,args: { data: GuideCreationInput },context:Context) =>{
            return context.prisma.guides.create({
                data : {
                    title : args.data.title,
                    description:args.data.description,
                    body:args.data.body,
                    user: {
                        connect :  {email : args.data.user.email}
                    }
                }
            });
        },
        createQuiz: (_parent,args: { data: QuizCreationInput },context:Context)=>{
            return context.prisma.quizzes.create({
                data: {
                    title: args.data.title,
                    description: args.data.description,
                    body: args.data.body,
                    guide: {
                        connect : {id : args.data.guide.id}
                    }
                }
            });
        }
    }
 
  } 