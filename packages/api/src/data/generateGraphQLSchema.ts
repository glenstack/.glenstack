/* eslint-disable */
import SchemaBuilder from "@giraphql/core";

import { Expr, query as q } from "faunadb";
import { client } from "./fauna/client";
import { generateFaunaQuery } from "./generateFaunaQuery";
import { FaunaSchema, Field, Table } from "./types";
import { GraphQLResolveInfo, GraphQLSchema } from "graphql";

const definitions = (table: Table) => ({
  queries: {
    findMany: {
      name: () => table.apiName + "GetMany",
      query: () =>
        q.Map(
          q.Paginate(q.Documents(q.Collection(table.id)), {}),
          q.Lambda("ref", q.Get(q.Var("ref")))
        ),
    },
    createOne: {
      name: () => table.apiName + "CreateOne",
      query: () => null,
    },
  },
});

// const getGiraphType = (
//   type: string
// ): GiraphQLSchemaTypes.FieldOptions["type"] => {
//   return type;
// };

export const generateGraphQLSchema = (projectData: any): GraphQLSchema => {
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
  let tableIdToApiName: Record<string, string> = {};
  const faunaSchema: FaunaSchema = projectData.tables.reduce(function (
    tableObj: FaunaSchema,
    table: {
      apiName: string;
      name: string;
      id: string;
      fields: Array<Field>;
    }
  ) {
    tableIdToApiName[table.id] = table.apiName;
    tableObj[table.apiName] = {
      ...table,
      fields: table.fields.reduce(function (
        fieldObj: Table["fields"],
        field: Field
      ) {
        fieldObj[field.apiName] = field;
        if (field.type === "Relation") {
          if (field.relationship.A.id === table.id) {
            // @ts-ignore
            fieldObj[field.apiName].relationKey = "A";
          } else if (field.relationship.B.id === table.id) {
            // @ts-ignore
            fieldObj[field.apiName].relationKey = "B";
          } else {
            throw new Error('Table does not match "A" or "B" in relationship.');
          }
        }

        return fieldObj;
      },
      {}),
    };
    return tableObj;
  }, {});

  const builder = new SchemaBuilder<{
    DefaultFieldNullability: true;
  }>({
    defaultFieldNullability: true,
  });

  builder.queryType({});
  builder.mutationType({});

  // let relationshipFields: { [key: string]: any } = {};
  let inputFields: {
    [tableApiName: string]: {
      [fieldApiName: string]: GiraphQLSchemaTypes.InputFieldOptions;
    };
  } = {};
  for (let table of Object.values(faunaSchema)) {
    // @ts-ignore
    builder.objectType(table.apiName, {
      fields: (t) => ({
        id: t.exposeID("id", {}),
      }),
    });
    inputFields[table.apiName] = {};

    for (let field of Object.values(table.fields)) {
      if (field.type === "Relation") {
        builder.inputType(tableIdToApiName[field.to.id] + "RelationInput", {
          fields: (t) => ({
            connect: t.field({ type: ["ID"], required: true }),
          }),
        });
      }

      // @ts-ignore
      builder.objectField(table.apiName, field.apiName, (t) =>
        // @ts-ignore
        t.expose(field.apiName, {
          // @ts-ignore
          type:
            field.type === "Relation"
              ? [tableIdToApiName[field.to.id]]
              : field.type,
        })
      );

      inputFields[table.apiName][field.apiName] = {
        // @ts-ignore
        type:
          field.type === "Relation"
            ? tableIdToApiName[field.to.id] + "RelationInput"
            : field.type,
        required: false,
      };
    }

    builder.queryField(definitions(table).queries.findMany.name(), (t) =>
      t.field({
        // @ts-ignore
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
        // @ts-ignore
        type: table.apiName,
        args: {
          // @ts-ignore
          input: t.arg({ type: table.apiName + "Input", required: true }),
        },
        resolve: (...args) => resolve(...args, faunaSchema),
      })
    );
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
  args: any,
  context: any,
  info: GraphQLResolveInfo,
  faunaSchema: any,
  query?: Expr
): Promise<any> => {
  console.log(faunaSchema);
  let result = await client.query(generateFaunaQuery(faunaSchema, info, query));
  console.log("res" + JSON.stringify(result));

  // @ts-ignore
  return result;
};
