/* eslint-disable */
// @ts-nocheck
import SchemaBuilder from "@giraphql/core";
import giraphFaunaPlugin from "./giraph-fauna-plugin";
import { Expr, query as q } from "faunadb";
import { client } from "./fauna/client";
import { generateFaunaQuery } from "./generateFaunaQuery";

export const generateGraphQLSchema = (projectData: any) => {
  const { tables } = projectData;

  // const faunaSchema = {
  //   Book: {
  //     collectionName: "294845138632442369",
  //     fields: {
  //       title: { fieldId: "294845251673129473", type: "string" },
  //       authors: {
  //         fieldId: "294845329476420097",
  //         relationshipRef: q.Ref(
  //           q.Collection("relationships"),
  //           "296152190589862405"
  //         ),
  //         type: "relation",
  //         // relation: "A",
  //         from: "A",
  //         to: "B",
  //       },
  //     },
  //   },
  //   Author: {
  //     collectionName: "294845159814726145",
  //     fields: {
  //       name: { fieldId: "294845354656924161", type: "string" },
  //       books: {
  //         fieldId: "294845383336526337",
  //         relationshipRef: q.Ref(
  //           q.Collection("relationships"),
  //           "296152190589862405"
  //         ),
  //         type: "relation",
  //         // relation: "B",
  //         from: "B",
  //         to: "A",
  //       },
  //     },
  //   },
  // };

  const faunaSchema = tables.reduce(function (tableObj, table) {
    tableObj[table.apiName] = {
      ...table,
      fields: table.fields.reduce(function (fieldObj, field) {
        fieldObj[field.apiName] = field;
        return fieldObj;
      }, {}),
    };
    return tableObj;
  }, {});

  const builder = new SchemaBuilder<{
    DefaultFieldNullability: true;
  }>({ plugins: [] });

  builder.queryType({});

  let relationshipFields = {};

  for (let table of tables) {
    builder.objectType(table.apiName, {});

    for (let field of table.fields) {
      if (field.type === "relation") {
        relationshipFields[[field.from, field.relationshipRef]] = {
          ...field,
          parentApiName: table.apiName,
        };
      } else {
        builder.objectField(table.apiName, field.apiName, (t) =>
          t.expose(field.apiName, { type: field.type })
        );
      }
    }

    builder.queryField(table.name, (t) =>
      t.field({
        type: [table.apiName],
        resolve: (root: any, args, context: any, info: any) => {
          return resolve(
            root,
            args,
            context,
            info,
            q.Map(
              q.Paginate(q.Documents(q.Collection(table.collectionName)), {}),
              q.Lambda("ref", q.Get(q.Var("ref")))
            ),
            faunaSchema
          );
        },
      })
    );
  }

  for (let relationshipField of Object.values(relationshipFields)) {
    const {
      apiName: fieldApiName,
      parentApiName: tableApiName,
      to,
      relationshipRef,
    } = relationshipField;

    const relatedTableApiName =
      relationshipFields[[to, relationshipRef]].parentApiName;
    builder.objectField(tableApiName, fieldApiName, (t) =>
      t.expose(fieldApiName, { type: [relatedTableApiName] })
    );
  }

  // builder.objectType("Book", {
  //   faunaCollectionName: "294845138632442369",
  //   fields: (t) => ({
  //     title: t.exposeString("title", {}),
  //   }),
  // });
  // builder.objectType("Author", {
  //   faunaCollectionName: "294845159814726145",
  //   fields: (t) => ({
  //     name: t.exposeString("name", {}),
  //   }),
  // });
  //
  // builder.objectField("Book", "authors", (t) =>
  //   t.expose("authors", { type: ["Author"] })
  // );
  //
  // builder.queryType({
  //   fields: (t) => ({
  //     books: t.field({
  //       type: ["Book"],
  //
  //       resolve: (root: any, args, context: any, info: any) => {
  //         return resolve(
  //           root,
  //           args,
  //           context,
  //           info,
  //           q.Map(
  //             q.Paginate(q.Documents(q.Collection("294845138632442369")), {}),
  //             q.Lambda("ref", q.Get(q.Var("ref")))
  //           )
  //         );
  //       },
  //     }),
  //     authors: t.field({
  //       type: ["Author"],
  //
  //       resolve: (root: any, args, context: any, info: any) => {
  //         return resolve(
  //           root,
  //           args,
  //           context,
  //           info,
  //           q.Map(
  //             q.Paginate(q.Documents(q.Collection("294845159814726145")), {}),
  //             q.Lambda("ref", q.Get(q.Var("ref")))
  //           )
  //         );
  //       },
  //     }),
  //   }),
  // });
  // const RelatedAuthorInput = builder.inputType("RelatedAuthorInput", {
  //   fields: (t) => ({
  //     connect: t.field({ type: ["ID"], required: true }),
  //   }),
  // });
  // const BookInput = builder.inputType("BookInput", {
  //   fields: (t) => ({
  //     title: t.field({ type: "String", required: true }),
  //     authors: t.field({ type: "RelatedAuthorInput", required: false }),
  //   }),
  // });
  // const AuthorInput = builder.inputType("AuthorInput", {
  //   fields: (t) => ({
  //     name: t.field({ type: "String", required: true }),
  //   }),
  // });
  //
  // builder.mutationType({
  //   fields: (t) => ({
  //     createBook: t.field({
  //       type: "Book",
  //       args: {
  //         input: t.arg({ type: BookInput, required: true }),
  //       },
  //       resolve: (root: any, args, context: any, info: any) => {
  //         return resolve(root, args, context, info);
  //       },
  //     }),
  //   }),
  // });

  return builder.toSchema({});
};

const resolve = async (
  root: any,
  args,
  context: any,
  info: any,
  query?: Expr,
  faunaSchema: any
) => {
  console.log(faunaSchema);
  let result = await client.query(generateFaunaQuery(faunaSchema, info, query));
  console.log("res" + JSON.stringify(result));

  return result;
  return { title: "Harry Potter" };
};
