/* eslint-disable */
// @ts-nocheck
import SchemaBuilder from "@giraphql/core";
import giraphFaunaPlugin from "./giraph-fauna-plugin";
import { query as q } from "faunadb";
import { client } from "./fauna/client";
import { generateFaunaQuery } from "./utils";

const faunaSchema = {
  Book: {
    collectionName: "294845138632442369",
    fields: {
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
  },
};

export const generateGraphQLSchema = (projectData: any) => {
  const { tables } = projectData;

  const builder = new SchemaBuilder<{
    Objects: { Book: { title: string } };
  }>({ plugins: [giraphFaunaPlugin] });

  builder.objectType("Book", {
    faunaCollectionName: "294845138632442369",
    fields: (t) => ({
      title: t.exposeString("title", {}),
    }),
  });

  builder.queryType({
    fields: (t) => ({
      books: t.field({
        type: ["Book"],

        resolve: (root: any, args, context: any, info: any) => {
          return resolve(root, args, context, info);
        },
      }),
    }),
  });

  const BookInput = builder.inputType("BookInput", {
    fields: (t) => ({
      title: t.field({ type: "String", required: true }),
    }),
  });

  builder.mutationType({
    fields: (t) => ({
      createBook: t.field({
        type: "Book",
        args: {
          input: t.arg({ type: BookInput, required: true }),
        },
        resolve: (root: any, args, context: any, info: any) => {
          return resolve(root, args, context, info);
        },
      }),
    }),
  });

  return builder.toSchema({});
  //   const { queryTypes } = await generateQueryTypes(tables);

  //   return {
  //     schema: new GraphQLSchema({
  //       query: new GraphQLObjectType({
  //         name: "Query",
  //         description: "GraphQL root query type",
  //         fields: {
  //           ...queryTypes,
  //         },
  //       }),
  //     }),
  //   };
};

const resolve = async (root: any, args, context: any, info: any) => {
  console.log(faunaSchema);
  let result = await client.query(
    generateFaunaQuery(
      faunaSchema,
      info,
      q.Map(
        q.Paginate(q.Documents(q.Collection("294845138632442369")), {}),
        q.Lambda("ref", q.Get(q.Var("ref")))
      )
    )
  );
  console.log("res" + JSON.stringify(result));

  return result;
  return { title: "Harry Potter" };
};
