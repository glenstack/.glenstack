/* eslint-disable */
import SchemaBuilder, {
  InputFieldRef,
  InputShapeFromFields,
} from "@giraphql/core";

import { Expr, query as q, Client } from "faunadb";
import { generateFaunaQuery } from "./generateFaunaQuery";
import { FaunaSchema, Field, Table } from "./types";
import { GraphQLResolveInfo, GraphQLSchema } from "graphql";
import { definitions } from "./definitions";

// const getGiraphType = (
//   type: string
// ): GiraphQLSchemaTypes.FieldOptions["type"] => {
//   return type;
// };

export default (projectData: any, client: Client): GraphQLSchema => {
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
  const faunaSchema: FaunaSchema = projectData.tables.reduce(function (
    tableObj: FaunaSchema,
    table: {
      apiName: string;
      name: string;
      id: string;
      fields: Array<Field>;
    }
  ) {
    if (table.apiName in tableObj) {
      throw new Error("Encountered duplicate table name (table.apiName).");
    }
    tableIdToApiName[table.id] = table.apiName;
    tableObj[table.apiName] = {
      ...table,
      fields: table.fields.reduce(function (
        fieldObj: Table["fields"],
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

    builder.mutationField(definitions(table).queries.createOne.name(), (t) =>
      t.field({
        // @ts-ignore
        type: table.apiName,
        args: {
          // @ts-ignore
          input: t.arg({ type: table.apiName + "Input", required: true }),
        },
        resolve: (...args) =>
          resolve(
            ...args,
            faunaSchema,
            definitions(table).queries.createOne.query(args[1], faunaSchema)
          ),
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
