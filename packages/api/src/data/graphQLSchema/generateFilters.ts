/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import InputFieldBuilder from "@giraphql/core/lib/fieldUtils/input";
import {
  FaunaSchema,
  GiraphQLSchemaTypes,
  TypesWithDefaults,
  ScalarType,
} from "../types";

export default (
  builder: GiraphQLSchemaTypes.SchemaBuilder<
    GiraphQLSchemaTypes.ExtendDefaultTypes<GiraphQLSchemaTypes>
  >,
  table: FaunaSchema["_"]
): void => {
  //   for (let field of Object.values(table.fields)) {
  //     builder.inputType("InputWithCommonFields1", {
  //       fields: (t) => ({
  //         ...createInputFields(t),
  //       }),
  //     });
  //   }

  builder.inputType(table.apiName + "WhereInput", {
    fields: (t) =>
      Object.values(table.fields).reduce((attrs, field) => {
        if (
          typeof field.type === "string" &&
          builder.configStore.typeConfigs.has(field.type + "WhereInput")
        ) {
          //   !(field.type in createFilterFields(t))
          return {
            ...attrs,
            [field.apiName]: t.field({
              //@ts-ignore
              type: field.type + "WhereInput",
              required: false,
            }),
          };
        } else {
          return attrs;
        }
      }, {}),
  });
};

// const createFilterFields = (
//   t: InputFieldBuilder<TypesWithDefaults, "InputObject">
// ) => ({
//   String: {
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
//   },
// });
