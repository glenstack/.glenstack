/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Expr, ExprArg, query as q } from "faunadb";
import { Table, FaunaSchema, RelationshipField } from "./types";

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

const generateOperators = (
  fieldId: string,
  value: ExprArg
): Record<string, Expr> => ({
  equals: q.Equals(value, q.Select(["data", fieldId], q.Get(q.Var("ref")))),
  not: q.Not(q.Equals(value, q.Select(["data", fieldId], q.Get(q.Var("ref"))))),
  lt: q.Equals(value, q.Select(["data", fieldId], q.Get(q.Var("ref")))),
});

export const definitions = (
  table: Pick<Table, "apiName" | "id">
): {
  queries: {
    [p: string]: {
      name: () => string;
      // @ts-ignore
      query: (args: any, faunaSchema?: FaunaSchema) => Expr;
    };
  };
} => ({
  queries: {
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
                generateOperators(
                  faunaSchema[table.apiName].fields[fieldName].id,
                  value
                )[operator]
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
  },
});
