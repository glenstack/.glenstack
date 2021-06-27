/* eslint-disable */
import SchemaBuilder, {
  InputFieldRef,
  InputShapeFromFields,
} from "@giraphql/core";

import { Expr, query as q, Client } from "faunadb";
import { generateFaunaQuery } from "./generateFaunaQuery";
import { FaunaSchema, Field, Project, Table } from "./types";
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLSchema } from "graphql";
import { definitions } from "./definitions";
import { GraphQLEmailAddress, GraphQLJSON } from "graphql-scalars";

// const getGiraphType = (
//   type: string
// ): GiraphQLSchemaTypes.FieldOptions["type"] => {
//   return type;
// };

export default (project: Project, client: Client): GraphQLSchema => {
  const resolve = async (
    root: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo,
    faunaSchema: any,
    query?: Expr
  ): Promise<any> => {
    console.log(faunaSchema);
    let result = await client.query(
      generateFaunaQuery(faunaSchema, info, query)
    );
    console.log("res" + JSON.stringify(result));

    return result;
  };

  let tableIdToApiName: Record<string, string> = {};
  const faunaSchema: FaunaSchema = project.tables.reduce(function (
    tableObj: FaunaSchema,
    table: Table
  ) {
    if (table.apiName in tableObj) {
      throw new Error("Encountered duplicate table name (table.apiName).");
    }
    tableIdToApiName[table.id] = table.apiName;
    tableObj[table.apiName] = {
      ...table,
      fields: table.fields.reduce(function (
        fieldObj: Record<string, Field>,
        field: Field
      ) {
        if (field.apiName in fieldObj) {
          throw new Error("Encountered duplicate field name (field.apiName).");
        }
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
  },
  {});

  const builder = new SchemaBuilder<{
    DefaultFieldNullability: true;
    Scalars: {
      Number: {
        Input: number;
        Output: number;
      };
      EmailAddress: {
        Input: GraphQLScalarType;
        Output: GraphQLScalarType;
      };
      JSON: {
        Input: GraphQLScalarType;
        Output: GraphQLScalarType;
      };
    };
  }>({
    defaultFieldNullability: true,
  });

  builder.addScalarType("EmailAddress", GraphQLEmailAddress, {});
  builder.addScalarType("JSON", GraphQLJSON, {});

  builder.scalarType("Number", {
    serialize: (n) => n,
    parseValue: (n) => {
      if (typeof n === "number") {
        return n;
      }

      throw new Error("Value must be a number");
    },
  });
  builder.queryType({});
  builder.mutationType({});

  // let relationshipFields: { [key: string]: any } = {};

  for (let table of Object.values(faunaSchema)) {
    // @ts-ignore
    builder.objectType(table.apiName, {
      fields: (t) => ({
        id: t.exposeID("id", {}),
      }),
    });

    for (let field of Object.values(table.fields)) {
      if (field.type === "Relation") {
        builder.inputType(
          tableIdToApiName[field.to.id] + "CreateRelationInput",
          {
            fields: (t) => ({
              connect: t.field({ type: ["ID"], required: true }),
            }),
          }
        );
        builder.inputType(
          tableIdToApiName[field.to.id] + "UpdateRelationInput",
          {
            fields: (t) => ({
              connect: t.field({ type: ["ID"], required: false }),
              disconnect: t.field({ type: ["ID"], required: false }),
            }),
          }
        );
        // @ts-ignore
        builder.objectField(table.apiName, field.apiName, (t) =>
          // @ts-ignore
          t.expose(field.apiName, {
            // @ts-ignore
            type: [tableIdToApiName[field.to.id]],
          })
        );
      } else {
        // @ts-ignore
        builder.objectField(table.apiName, field.apiName, (t) =>
          // @ts-ignore
          t.expose(field.apiName, {
            // @ts-ignore
            type: field.type,
          })
        );
      }
    }

    builder.queryField(definitions(table).queries.findMany.name(), (t) =>
      t.field({
        // @ts-ignore
        type: [table.apiName],
        args: {
          first: t.arg({ type: "Int", required: false, defaultValue: 100 }),
          after: t.arg({ type: "String", required: false }),
          before: t.arg({ type: "String", required: false }),
        },
        resolve: (...args) =>
          resolve(
            ...args,
            faunaSchema,
            definitions(table).queries.findMany.query(args[1])
          ),
      })
    );
    builder.queryField(definitions(table).queries.findOne.name(), (t) =>
      t.field({
        // @ts-ignore
        type: table.apiName,
        args: {
          id: t.arg({ type: "String", required: true }),
        },
        resolve: (...args) =>
          resolve(
            ...args,
            faunaSchema,
            definitions(table).queries.findOne.query(args[1])
          ),
      })
    );

    builder.mutationField(definitions(table).queries.createOne.name(), (t) =>
      t.field({
        // @ts-ignore
        type: table.apiName,
        args: {
          // @ts-ignore
          input: t.arg({ type: table.apiName + "CreateInput", required: true }),
        },
        resolve: (...args) =>
          resolve(
            ...args,
            faunaSchema,
            definitions(table).queries.createOne.query(args[1], faunaSchema)
          ),
      })
    );
    builder.mutationField(definitions(table).queries.updateOne.name(), (t) =>
      t.field({
        // @ts-ignore
        type: table.apiName,
        args: {
          // @ts-ignore
          input: t.arg({ type: table.apiName + "UpdateInput", required: true }),
          id: t.arg({ type: "ID", required: true }),
        },
        resolve: (...args) =>
          resolve(
            ...args,
            faunaSchema,
            definitions(table).queries.updateOne.query(args[1], faunaSchema)
          ),
      })
    );

    builder.inputType(table.apiName + "CreateInput", {
      fields: (t) =>
        Object.values(table.fields).reduce(
          (attrs, field) => ({
            ...attrs,
            [field.apiName]: t.field({
              //@ts-ignore
              type:
                field.type === "Relation"
                  ? tableIdToApiName[field.to.id] + "CreateRelationInput"
                  : field.type,
              required: false,
            }),
          }),
          {}
        ),
    });
    builder.inputType(table.apiName + "UpdateInput", {
      fields: (t) =>
        Object.values(table.fields).reduce(
          (attrs, field) => ({
            ...attrs,

            [field.apiName]: t.field({
              //@ts-ignore
              type:
                field.type === "Relation"
                  ? tableIdToApiName[field.to.id] + "UpdateRelationInput"
                  : field.type,
              required: false,
            }),
          }),
          {}
        ),
    });
  }

  return builder.toSchema({});
};
