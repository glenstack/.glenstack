/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Expr, ExprArg, query as q } from "faunadb";

import {
  Table,
  FaunaSchema,
  RelationshipField,
  ScalarType,
  ScalarField,
} from "./types";

const generateRelationQueries = (field: RelationshipField) => {
  const existingRelation = (id: string) =>
    q.Match(q.Index("relations_unique"), [
      field.relationshipRef,
      field.relationKey === "A"
        ? q.Var("docRef")
        : q.Ref(q.Collection(field.to.id), id),
      field.relationKey === "B"
        ? q.Var("docRef")
        : q.Ref(q.Collection(field.to.id), id),
    ]);

  return {
    connect: (ids: Array<string>) => {
      if (!ids) return [];
      return ids.map((id: string) =>
        q.If(
          q.Exists(
            q.Ref(
              // @ts-ignore
              q.Collection(field.to.id),
              // @ts-ignore
              id
            )
          ),
          q.If(
            q.IsEmpty(existingRelation(id)),
            q.Create(q.Collection("relations"), {
              data: {
                // @ts-ignore
                relationshipRef: field.relationshipRef,
                // @ts-ignore
                [field.relationKey]: q.Var("docRef"),
                // @ts-ignore
                [field.relationKey === "A" ? "B" : "A"]: q.Ref(
                  // @ts-ignore
                  q.Collection(field.to.id),
                  // @ts-ignore
                  id
                ),
              },
            }),
            q.Abort(`Object with id ${field.to.id} is already connected.`)
          ),
          q.Abort(
            `Cannot connect object with id ${field.to.id} as it does not exist.`
          )
        )
      );
    },
    disconnect: (ids: Array<string>) => {
      if (!ids) return [];
      return ids.map((id: string) =>
        q.If(
          q.Exists(
            q.Ref(
              // @ts-ignore
              q.Collection(field.to.id),
              // @ts-ignore
              id
            )
          ),
          q.If(
            q.IsEmpty(existingRelation(id)),
            q.Abort(`Object with id ${field.to.id} was not connected.`),

            q.Map(
              q.Paginate(existingRelation(id)),
              q.Lambda("X", q.Delete(q.Var("X")))
            )
          ),
          q.Abort(
            `Cannot disconnect object with id ${field.to.id} as it does not exist.`
          )
        )
      );
    },
  };
};

export const definitions: {
  operators: Record<
    string,
    {
      allowedTypes: Array<ScalarType>;
      argType: (type: ScalarType) => ScalarField["type"];
      expr: (fieldId: string, value: ExprArg) => Expr;
    }
  >;
  queries: (table: Pick<Table, "apiName" | "id">) => {
    [p: string]: {
      name: () => string;
      query: (args: any, faunaSchema: FaunaSchema) => Expr;
    };
  };
} = {
  operators: {
    equals: {
      allowedTypes: ["String", "Number", "Boolean", "JSON", "EmailAddress"],
      argType: (type: ScalarType) => type,
      expr: (fieldId: string, value: ExprArg) =>
        //@ts-ignore
        q.Equals(q.Select(["data", fieldId], q.Get(q.Var("ref")), null), value),
    },
    notEquals: {
      allowedTypes: ["String", "Number", "Boolean", "JSON", "EmailAddress"],
      argType: (type: ScalarType) => type,
      expr: (fieldId: string, value: ExprArg) =>
        q.Not(
          q.Equals(
            //@ts-ignore
            q.Select(["data", fieldId], q.Get(q.Var("ref")), null),
            value
          )
        ),
    },
    lt: {
      allowedTypes: ["String", "Number", "Boolean", "JSON", "EmailAddress"],
      argType: (type: ScalarType) => type,
      expr: (fieldId: string, value: ExprArg) =>
        //@ts-ignore
        q.LT(q.Select(["data", fieldId], q.Get(q.Var("ref")), null), value),
    },
    gt: {
      allowedTypes: ["String", "Number", "Boolean", "JSON", "EmailAddress"],
      argType: (type: ScalarType) => type,
      expr: (fieldId: string, value: ExprArg) =>
        //@ts-ignore
        q.GT(q.Select(["data", fieldId], q.Get(q.Var("ref")), null), value),
    },
    startsWith: {
      allowedTypes: ["String", "EmailAddress"],
      argType: (type: ScalarType) => type,
      expr: (fieldId: string, value: ExprArg) =>
        //@ts-ignore
        q.StartsWith(
          q.Select(["data", fieldId], q.Get(q.Var("ref")), ""),
          value
        ),
    },
    endsWith: {
      allowedTypes: ["String", "EmailAddress"],
      argType: (type: ScalarType) => type,
      expr: (fieldId: string, value: ExprArg) =>
        //@ts-ignore
        q.EndsWith(q.Select(["data", fieldId], q.Get(q.Var("ref")), ""), value),
    },
    contains: {
      allowedTypes: ["String", "EmailAddress"],
      argType: (type: ScalarType) => type,
      expr: (fieldId: string, value: ExprArg) =>
        //@ts-ignore
        q.ContainsStr(
          q.Select(["data", fieldId], q.Get(q.Var("ref")), ""),
          value
        ),
    },
  },
  queries: (table: Pick<Table, "apiName" | "id">) => ({
    findMany: {
      name: (): string => "query" + table.apiName,
      // @ts-ignore
      query: (
        args: {
          first: number;
          before: string;
          after: string;
          where: Record<string, Record<string, ExprArg>>;
        },
        faunaSchema: FaunaSchema
      ): Expr => {
        const options: { size: number; after?: Expr; before?: Expr } = {
          size: args.first,
        };
        if (args.after) {
          options.after = q.Ref(q.Collection(table.id), args.after);
        }
        if (args.before) {
          options.before = q.Ref(q.Collection(table.id), args.before);
        }
        const filters: Array<boolean | Expr> = [];
        if (args.where) {
          for (const [fieldName, operators] of Object.entries(args.where)) {
            for (const [operator, value] of Object.entries(operators)) {
              filters.push(
                definitions.operators[operator].expr(
                  faunaSchema[table.apiName].fields[fieldName].id,
                  value
                )
              );
            }
          }
        }
        if (filters.length > 0) {
          return q.Map(
            q.Filter(
              q.Paginate(q.Documents(q.Collection(table.id)), { ...options }),
              q.Lambda("ref", q.And(...filters))
            ),
            q.Lambda("ref", q.Get(q.Var("ref")))
          );
        }
        return q.Map(
          q.Paginate(q.Documents(q.Collection(table.id)), { ...options }),

          q.Lambda("ref", q.Get(q.Var("ref")))
        );
      },
    },
    findOne: {
      name: (): string => "get" + table.apiName,
      // @ts-ignore
      query: (args: { id: string }): Expr => {
        return q.Get(q.Ref(q.Collection(table.id), args.id));
      },
    },
    createOne: {
      name: () => table.apiName + "CreateOne",
      // @ts-ignore
      query: (
        // @ts-ignore
        args,
        faunaSchema: FaunaSchema
      ) => {
        const data: Record<string, unknown> = {};
        let relationQueries: Array<Expr> = [];
        // const args = getArgumentValues(field, node);
        for (const [key, value] of Object.entries(args.input)) {
          const faunaField = faunaSchema[table.apiName].fields[key];
          if (faunaField.type === "Relation") {
            relationQueries = [
              ...relationQueries,
              // @ts-ignore
              ...generateRelationQueries(faunaField).connect(value.connect),
            ];
          } else {
            data[faunaField.id] = value;
          }
        }
        return q.Select(
          ["doc"],
          q.Let(
            {
              docRef: q.Select(
                ["ref"],
                q.Create(q.Collection(faunaSchema[table.apiName].id), {
                  data,
                })
              ),
            },
            {
              doc: q.Get(q.Var("docRef")),
              relationQueries: q.Do(relationQueries),
            }
          )
        );
      },
    },
    updateOne: {
      name: () => table.apiName + "UpdateOne",
      // @ts-ignore
      query: (
        // @ts-ignore
        args: GiraphQLFieldKindToConfig<table.apiName, "args">,
        faunaSchema: FaunaSchema
      ) => {
        const data: Record<string, unknown> = {};
        let relationQueries: Array<Expr> = [];
        // const args = getArgumentValues(field, node);
        for (const [key, value] of Object.entries(args.input)) {
          const faunaField = faunaSchema[table.apiName].fields[key];
          if (faunaField.type === "Relation") {
            relationQueries = [
              ...relationQueries,
              // @ts-ignore
              ...generateRelationQueries(faunaField).connect(value.connect),
              ...generateRelationQueries(faunaField).disconnect(
                // @ts-ignore
                value.disconnect
              ),
            ];
          } else {
            data[faunaField.id] = value;
          }
        }
        return q.Select(
          ["doc"],
          q.Let(
            {
              toUpdateRef: q.Ref(
                q.Collection(faunaSchema[table.apiName].id),
                args.id
              ),
              docRef: q.If(
                q.Exists(q.Var("toUpdateRef")),
                q.Select(
                  ["ref"],
                  q.Update(q.Var("toUpdateRef"), {
                    data,
                  })
                ),
                q.Abort("Object does not exist.")
              ),
            },
            {
              doc: q.Get(q.Var("docRef")),
              relationQueries: q.Do(relationQueries),
            }
          )
        );
      },
    },
  }),
};
