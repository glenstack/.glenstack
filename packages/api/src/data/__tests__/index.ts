import { ApolloServer } from "apollo-server";
import { Client, query as q } from "faunadb";
// import { getSchema } from "../index";
import { GraphQLSchema } from "graphql";
import scaffold from "../fauna/scaffold";
import admin from "../fauna/admin";

test("data" + "", async () => {
  jest.setTimeout(30000);

  const test_db_name = "bnewtest_" + Date.now();

  const client = new Client({
    secret: "fnAEKpUbg1ACBTYHxtqayKNrCnnmgHLyWoSSlyvX",
  });
  // const schema: GraphQLSchema = await getSchema();
  // const server = new ApolloServer({
  //   schema,
  // });
  await client.query(q.CreateDatabase({ name: test_db_name }));

  const { secret }: { secret: string } = await client.query(
    q.CreateKey({
      database: q.Database(test_db_name),
      role: "server",
    })
  );
  const test_client = new Client({
    secret,
  });
  const {
    createOrganization,
    createProject,
    createTable,
    createScalarField,
    createRelationshipField,
  } = admin(test_client);
  await scaffold(test_client);
  const { id: organizationId } = await createOrganization({
    name: "LibraryOrg",
  });
  const { id: projectId } = await createProject({
    name: "LibraryProj",
    organizationId,
  });

  const { id: bookTableId } = await createTable({
    name: "Books",
    projectId,
  });
  const { id: authorTableId } = await createTable({
    name: "Authors",
    projectId,
  });

  await createScalarField({
    name: "title",
    tableId: bookTableId,
    type: "String",
  });
  await createScalarField({
    name: "name",
    tableId: authorTableId,
    type: "String",
  });

  await createRelationshipField({
    name: "authors",
    backName: "books",
    to: authorTableId,
    tableId: bookTableId,
  });

  // const tables =

  // await client.query(q.Delete(q.Database(test_db_name)));

  expect(2 + 2).toBe(4);
});
