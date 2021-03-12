import { query as q } from "faunadb";
import { client } from "./client";

export const testFauna = async () => {
  return await client.query(q.ToDate("2020-03-12"));
};
