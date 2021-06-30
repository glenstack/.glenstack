/* eslint-disable */
import SchemaBuilder, {
  ArgBuilder,
  InputFieldMap,
  InputFieldRef,
  InputShapeFromFields,
} from "@giraphql/core";

import { Expr, query as q, Client } from "faunadb";
import { generateFaunaQuery } from "../generateFaunaQuery";
import {
  FaunaSchema,
  Field,
  Project,
  Table,
  GiraphQLSchemaTypes,
  ScalarField,
} from "../types";
import { GraphQLResolveInfo, GraphQLSchema } from "graphql";
import { definitions } from "../definitions";
import { GraphQLEmailAddress, GraphQLJSON } from "graphql-scalars";
import buildFilterInputs from "./buildFilterInputs";

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

  const builder = new SchemaBuilder<GiraphQLSchemaTypes>({
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

  const operatorArgsByType = Object.entries(definitions.operators).reduce(
    (
      obj: Record<string, Record<string, ScalarField["type"]>>,
      [operator, value]
    ) => {
      for (const allowedType of value.allowedTypes) {
        obj[allowedType] = obj[allowedType] || {};
        obj[allowedType][operator] = value.argType(allowedType);
      }
      return obj;
    },
    {}
  );

  for (const [scalarType, value] of Object.entries(operatorArgsByType)) {
    builder.inputType(scalarType + "WhereInput", {
      fields: (t) =>
        Object.entries(value).reduce(
          (obj: InputFieldMap, [operator, argType]) => {
            obj[operator] = t.field({ type: argType, required: false });

            return obj;
          },
          {}
        ),
    });
  }

  // builder.inputType("StringWhereInput", {
  //   fields: (t) => ({
  //     equals: t.field({ type: "String", required: false }),
  //     not: t.field({ type: "String", required: false }),
  //     in: t.field({ type: ["String"], required: false }),
  //     notIn: t.field({ type: ["String"], required: false }),
  //     contains: t.field({ type: "String", required: false }),
  //     startsWith: t.field({ type: "String", required: false }),
  //     endsWith: t.field({ type: "String", required: false }),
  //     lt: t.field({ type: "String", required: false }),
  //     lte: t.field({ type: "String", required: false }),
  //     gt: t.field({ type: "String", required: false }),
  //     gte: t.field({ type: "String", required: false }),
  //   }),
  // });

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

    builder.queryField(definitions.queries(table).findMany.name(), (t) =>
      t.field({
        // @ts-ignore
        type: [table.apiName],
        args: {
          first: t.arg({ type: "Int", required: false, defaultValue: 100 }),
          after: t.arg({ type: "String", required: false }),
          before: t.arg({ type: "String", required: false }),
          //@ts-ignore
          where: t.arg({ type: table.apiName + "WhereInput", required: false }),
        },
        resolve: (...args) =>
          resolve(
            ...args,
            faunaSchema,
            definitions.queries(table).findMany.query(args[1], faunaSchema)
          ),
      })
    );
    builder.queryField(definitions.queries(table).findOne.name(), (t) =>
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
            definitions.queries(table).findOne.query(args[1], faunaSchema)
          ),
      })
    );

    builder.mutationField(definitions.queries(table).createOne.name(), (t) =>
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
            definitions.queries(table).createOne.query(args[1], faunaSchema)
          ),
      })
    );
    builder.mutationField(definitions.queries(table).updateOne.name(), (t) =>
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
            definitions.queries(table).updateOne.query(args[1], faunaSchema)
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

    buildFilterInputs(builder, table);
  }

  return builder.toSchema({});
};
