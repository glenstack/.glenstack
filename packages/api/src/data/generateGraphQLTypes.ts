/* eslint-disable */
// @ts-nocheck

import {
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from "graphql";

import { query as q } from "faunadb";
import { GraphQLFaunaObjectType, generateFaunaQuery } from "./utils";
import { client } from "./fauna/client";

const bookType = new GraphQLFaunaObjectType({
  name: "Book",
  collectionName: "294845138632442369",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    authors: {
      type: GraphQLList(authorType),
    },
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
      // relation: "A",
      from: "A",
      to: "B",
    },
  },
});

const bookInputType = new GraphQLInputObjectType({
  name: "bookInput",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    authors: { type: relatedAuthorsInputType },
  }),
});
const authorInputType = new GraphQLInputObjectType({
  name: "authorInput",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    books: { type: relatedBooksInputType },
  }),
});

const relatedAuthorsInputType = new GraphQLInputObjectType({
  name: "relatedAuthorsInput",
  fields: () => ({
    connect: { type: new GraphQLList(GraphQLID) },
  }),
});
const relatedBooksInputType = new GraphQLInputObjectType({
  name: "relatedBooksInput",
  fields: () => ({
    connect: { type: new GraphQLList(GraphQLID) },
  }),
});

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
      // relation: "B",
      from: "B",
      to: "A",
    },
  },
});

export const queryType = new GraphQLObjectType({
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

export const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createBook: {
      type: bookType,
      args: {
        input: { type: bookInputType },
      },
      resolve: async (obj: any, args, context: any, info: any) => {
        let result = await client.query(generateFaunaQuery(info));

        return result;
      },
    },
  },
});
