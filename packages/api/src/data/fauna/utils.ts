import { Client, query as q } from "faunadb";

export const createCollectionAndWait = async (
  client: Client,
  id: string
): Promise<void> => {
  await client.query(q.CreateCollection({ name: id }));
  while (!(await client.query(q.Exists(q.Collection(id))))) {
    console.log("waiting");
  }
};
