/* eslint-disable */
// @ts-nocheck
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Expr, query as q } from "faunadb";
import { GraphQLFaunaObjectType, generateFaunaQuery } from "./utils";
import _ from "lodash";
import { client } from "./fauna/client";
import Debug from "debug";
const debug = Debug("GraphQL");

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
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from "graphql";

const bookType = new GraphQLFaunaObjectType({
  name: "Book",
  collectionName: "294845138632442369",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    authors: { type: GraphQLList(authorType) },
  }),
  metaSchema: {
    title: { fieldId: "294845251673129473", type: "string" },
    authors: {
      fieldId: "294845329476420097",
      relationshipRef: q.Ref(
        q.Collection("relationships"),
        "296152190589862405"
      ),
      type: "relation",
      relation: "A",
    },
  },
});

class GraphQLFaunaInputObjectType extends GraphQLInputObjectType {
  collectionName: string;
  constructor(args: any) {
    super(args);
    this.collectionName = args.collectionName;
  }
}
class GraphQLFaunaRelatedInputObjectType extends GraphQLInputObjectType {
  relatedType: GraphQLFaunaInputObjectType;
  constructor(args: any) {
    super(args);
    this.relatedType = args.relatedType;
  }
}
const bookInputType = new GraphQLFaunaInputObjectType({
  name: "bookInput",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    authors: { type: relatedAuthorsInputType },
  }),
});
const authorInputType = new GraphQLFaunaInputObjectType({
  name: "authorInput",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    books: { type: relatedBooksInputType },
  }),
});

const relatedAuthorsInputType = new GraphQLFaunaRelatedInputObjectType({
  name: "relatedAuthorsInput",
  relatedType: authorInputType,
  fields: () => ({
    connect: { type: new GraphQLList(GraphQLID) },
  }),
});
const relatedBooksInputType = new GraphQLFaunaRelatedInputObjectType({
  name: "relatedBooksInput",
  relatedType: bookInputType,
  fields: () => ({
    connect: { type: new GraphQLList(GraphQLID) },
  }),
});

// const relatedInputType = new GraphQLInputObjectType({
//   name: 'relatedInput',
//   fields: () => ({

//     ids

//   })})

const authorType = new GraphQLFaunaObjectType({
  name: "Author",
  collectionName: "294845159814726145",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    books: { type: GraphQLList(bookType) },
  }),
  metaSchema: {
    name: { fieldId: "294845354656924161", type: "string" },
    books: {
      fieldId: "294845383336526337",
      relationshipRef: q.Ref(
        q.Collection("relationships"),
        "296152190589862405"
      ),
      type: "relation",
      relation: "B",
    },
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    books: {
      type: GraphQLList(bookType),

      resolve: async (obj: any, { size }, context: any, info: any) => {
        let result = await client.query(
          generateFaunaQuery(
            info,
            q.Map(
              q.Paginate(q.Documents(q.Collection(bookType.collectionName)), {
                size,
              }),
              q.Lambda("ref", q.Get(q.Var("ref")))
            )
          )
        );
        console.log("res" + JSON.stringify(result));

        return result;
      },
    },
    authors: {
      type: GraphQLList(authorType),

      resolve: async (obj: any, { size }, context: any, info: any) => {
        let result = await client.query(
          generateFaunaQuery(
            info,
            q.Map(
              q.Paginate(q.Documents(q.Collection(authorType.collectionName)), {
                size,
              }),
              q.Lambda("ref", q.Get(q.Var("ref")))
            )
          )
        );
        console.log("res" + JSON.stringify(result));

        return result;
      },
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createBook: {
      type: bookType,
      args: {
        input: { type: bookInputType },
      },
      resolve: async (obj: any, args, context: any, info: any) => {
        debug(args);
        console.log(JSON.stringify(args));
        console.log(info);
        let data = {};
        let relationQueries;

        for (let [key, value] of Object.entries(args.input)) {
          if (bookType.metaSchema[key].type === "relation") {
            console.log("side:" + bookType.metaSchema[key].relation);
            relationQueries = q.Create(q.Collection("relations"), {
              data: {
                relationshipRef: bookType.metaSchema[key].relationshipRef,
                [bookType.metaSchema[key].relation]: q.Var("docRef"),
                [bookType.metaSchema[key].relation === "A" ? "B" : "A"]: q.Ref(
                  q.Collection("294845159814726145"),
                  value.connect[0]
                ),
              },
            });
          } else {
            data[bookType.metaSchema[key].fieldId] = value;
          }
        }

        // let data = {data: Object.fromEntries(Object.entries(args.input).filter(([key, value]) => bookType.metaSchema[key].type !== "relation").map( ([key, value]) => [bookType.metaSchema[key].fieldId, value] ))}
        let creationResult = await client.query(
          q.Let(
            {
              docRef: q.Select(
                ["ref"],
                q.Create(q.Collection(bookType.collectionName), { data })
              ),
            },
            { ref: q.Var("docRef") }
          )
        );
        let result = await client.query(
          generateFaunaQuery(info, q.Get(creationResult.ref))
        );

        console.log(JSON.stringify(data));
        console.log("info" + JSON.stringify(info.selectionSet));
        console.log("res" + JSON.stringify(creationResult.ref));
        return result;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
