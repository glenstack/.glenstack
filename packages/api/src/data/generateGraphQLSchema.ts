/* eslint-disable */
// @ts-nocheck
import SchemaBuilder from "@giraphql/core";

import { Expr, query as q } from "faunadb";
import { client } from "./fauna/client";
import { generateFaunaQuery } from "./generateFaunaQuery";

const definitions = (table: any) => ({
  queries: {
    findMany: {
      name: () => table.apiName + "GetMany",
      query: () =>
        q.Map(
          q.Paginate(q.Documents(q.Collection(table.collectionName)), {}),
          q.Lambda("ref", q.Get(q.Var("ref")))
        ),
    },
    createOne: {
      name: () => table.apiName + "CreateOne",
      query: () => null,
    },
  },
});

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
  builder.mutationType({});

  let relationshipFields = {};
  let inputFields = {};
  for (let table of tables) {
    builder.objectType(table.apiName, {
      fields: (t) => ({
        id: t.exposeID("id", {}),
      }),
    });
    inputFields[table.apiName] = {};

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
        inputFields[table.apiName][field.apiName] = {
          type: field.type,
          required: false,
        };
      }
    }

    builder.queryField(definitions(table).queries.findMany.name(), (t) =>
      t.field({
        type: [table.apiName],
        resolve: (...args) =>
          resolve(
            ...args,
            faunaSchema,
            definitions(table).queries.findMany.query()
          ),
      })
    );
    builder.mutationField(definitions(table).queries.createOne.name(), (t) =>
      t.field({
        type: table.apiName,
        args: {
          input: t.arg({ type: table.apiName + "Input", required: true }),
        },
        resolve: (...args) => resolve(...args, faunaSchema),
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
    inputFields[tableApiName][fieldApiName] = {
      type: relatedTableApiName + "RelationInput",
      required: false,
    };
    if (
      !builder.configStore.typeConfigs.has(
        relatedTableApiName + "RelationInput"
      )
    ) {
      builder.inputType(relatedTableApiName + "RelationInput", {
        fields: (t) => ({
          connect: t.field({ type: ["ID"], required: true }),
        }),
      });
    }
  }

  for (const [tableApiName, tableInputFields] of Object.entries(inputFields)) {
    if (!builder.configStore.typeConfigs.has(tableApiName + "Input")) {
      builder.inputType(tableApiName + "Input", {
        fields: (t) =>
          Object.keys(tableInputFields).reduce(
            (attrs, key) => ({
              ...attrs,
              [key]: t.field(tableInputFields[key]),
            }),
            {}
          ),
      });
    }
  }

  return builder.toSchema({});
};

const resolve = async (
  root: any,
  args,
  context: any,
  info: any,
  faunaSchema: any,
  query: Expr
) => {
  console.log(faunaSchema);
  let result = await client.query(generateFaunaQuery(faunaSchema, info, query));
  console.log("res" + JSON.stringify(result));

  return result;
};
