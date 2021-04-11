import { makeExecutableSchema } from "@graphql-tools/schema";
import { Expr, query as q } from 'faunadb';
import { GraphQLFaunaObjectType, generateFaunaQuery } from "../../data/fauna";

import { client } from '../../data/fauna/client';

import {

  TypeInfo,
  visit,
  visitWithTypeInfo,
  isLeafType,
  GraphQLList,
  GraphQLResolveInfo,
  defaultFieldResolver,
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLID
} from "graphql"



const bookType = new GraphQLFaunaObjectType({
  name: 'Book',
  collectionName: "294845138632442369",
  fields: () => ({
    id: {type: GraphQLID},
    title: { type: GraphQLString },
    authors: {type: GraphQLList(authorType)}

  }),
  metaSchema:  {title: { fieldId: "294845251673129473", type:"string"}, authors: { fieldId: "294845329476420097", type:"relation",  from: 'A'}}
})

const authorType = new GraphQLFaunaObjectType({
  name: 'Author',
  collectionName: "294845159814726145",
  fields: () => ({
    id: {type: GraphQLID},
    name: { type: GraphQLString },
    books: {type: GraphQLList(bookType)}
    
  }),
  metaSchema:  {name: { fieldId: "294845354656924161", type:"string"}, books: { fieldId: "294845383336526337", type:"relation",  from: 'B'}}
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    books: {
      type: GraphQLList(bookType),
      
      resolve: async (obj: any, { size }, context: any, info: any) => {
      
        let result = await client.query(generateFaunaQuery(info, q.Map(
          q.Paginate(q.Documents(q.Collection(bookType.collectionName)), {
              size,
          }),
          q.Lambda("ref", q.Get(q.Var("ref")))
      )))
        console.log("res"+JSON.stringify(result))
      
      
        return result
      
    }
    },
    authors: {
      type: GraphQLList(authorType),
      
      resolve: async (obj: any, { size }, context: any, info: any) => {
      
        let result = await client.query(generateFaunaQuery(info, q.Map(
          q.Paginate(q.Documents(q.Collection(authorType.collectionName)), {
              size,
          }),
          q.Lambda("ref", q.Get(q.Var("ref")))
      )))
        console.log("res"+JSON.stringify(result))
      
      
        return result
      
    }
    }
  }
});



export const schema  = new GraphQLSchema({query: queryType});
// export const schema = makeExecutableSchema({ typeDefs, resolvers,  schemaDirectives: {
//   renameField
// } });
