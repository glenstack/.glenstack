/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { FaunaSchema, GiraphQLSchemaTypes } from "../types";

export default (
  builder: GiraphQLSchemaTypes.SchemaBuilder<
    GiraphQLSchemaTypes.ExtendDefaultTypes<GiraphQLSchemaTypes>
  >,
  table: FaunaSchema["_"]
): void => {
  builder.inputType(table.apiName + "WhereInput", {
    fields: (t) =>
      Object.values(table.fields).reduce((attrs, field) => {
        if (
          typeof field.type === "string" &&
          builder.configStore.typeConfigs.has(field.type + "WhereInput")
        ) {
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
