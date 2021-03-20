import { query as q, Expr } from 'faunadb';   


export function Query(inputs = {}, query : any) {

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
