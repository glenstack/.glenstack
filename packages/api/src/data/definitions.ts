/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Expr, query as q } from "faunadb";
import { Table, FaunaSchema } from "./types";

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
      name: (): string => table.apiName + "GetMany",
      // @ts-ignore
      query: (args): Expr => {
        const options: { size: number; after?: Expr; before?: Expr } = {
          size: args.first,
        };
        if (args.after) {
          options.after = q.Ref(q.Collection(table.id), args.after);
        }
        if (args.before) {
          options.before = q.Ref(q.Collection(table.id), args.before);
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
        {
          const data: Record<string, unknown> = {};
          let relationQueries;
          // const args = getArgumentValues(field, node);
          for (const [key, value] of Object.entries(args.input)) {
            const faunaField = faunaSchema[table.apiName].fields[key];
            if (faunaField.type === "Relation") {
              relationQueries = q.Do(
                // @ts-ignore
                value.connect.map((idToConnect: string) =>
                  q.Create(q.Collection("relations"), {
                    data: {
                      // @ts-ignore
                      relationshipRef: faunaField.relationshipRef,
                      // @ts-ignore
                      [faunaField.relationKey]: q.Var("docRef"),
                      // @ts-ignore
                      [faunaField.relationKey === "A" ? "B" : "A"]: q.Ref(
                        // @ts-ignore
                        q.Collection(faunaField.to.id),
                        // @ts-ignore
                        idToConnect
                      ),
                    },
                  })
                )
              );
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
              { doc: q.Get(q.Var("docRef")), relationQueries }
            )
          );
        }
      },
    },
  },
});
