import { query as q, ExprArg } from 'faunadb';


export function Query(inputs = {}, query: ExprArg) {

  if (Object.keys(inputs).length === 0) {
    return query
  }
  return q.Let(
    {
      ...inputs,
    },
    query,
  );
}

export function Queries(queries: Array<ExprArg>) {

  return q.Do(...queries)
  
}
