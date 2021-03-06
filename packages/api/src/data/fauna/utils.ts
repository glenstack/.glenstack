import to from "await-to-js";
import { Client, errors, ExprArg, Expr, query as q } from "faunadb";

const WithoutDuplicates = (
  expr: ExprArg,
  search: ExprArg,
  errorMessage: string
): Expr => {
  return q.If(q.IsEmpty(search), expr, q.Abort(errorMessage));
};

export const enrichedQuery = { ...q, WithoutDuplicates };

export const createCollectionAndWait = async (
  client: Client,
  id: string
): Promise<void> => {
  await client.query(q.CreateCollection({ name: id, history_days: null }));
  while (!(await client.query(q.Exists(q.Collection(id))))) {
    console.log("waiting");
  }
};

export async function query<T>(client: Client, expr: ExprArg): Promise<T> {
  const [err, data] = await to<T, errors.FaunaError>(client.query<T>(expr));

  if (err) throw new Error(err.description);
  if (!data) throw new Error("An unnkown error ocurred.");
  return data;
}
