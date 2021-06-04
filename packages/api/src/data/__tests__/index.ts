import { ApolloServer } from "apollo-server";
import { Client, query as q } from "faunadb";
import { getSchema } from "../index";
import { GraphQLSchema } from "graphql";
import scaffold from "../fauna/scaffold";
import admin from "../fauna/admin";
import { definitions } from "../definitions";

test("data" + "", async () => {
  jest.setTimeout(30000);

  const test_db_name = "cnewtest_" + Date.now();

  const client = new Client({
    secret: "fnAEKpUbg1ACBTYHxtqayKNrCnnmgHLyWoSSlyvX",
  });
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

  const bookTable = await createTable({
    name: "Books",
    projectId,
  });
  const authorTable = await createTable({
    name: "Authors",
    projectId,
  });

  await createScalarField({
    name: "title",
    tableId: bookTable.id,
    type: "String",
  });
  await createScalarField({
    name: "name",
    tableId: authorTable.id,
    type: "String",
  });

  await createRelationshipField({
    name: "authors",
    backName: "books",
    to: authorTable.id,
    tableId: bookTable.id,
  });

  const schema: GraphQLSchema = await getSchema(test_client);
  const server = new ApolloServer({
    schema,
  });
  console.log(`query { ${definitions(bookTable).queries.findMany.name()} {
    title
    authors {
      name
    }
  }}`);
  // const tables =
  const result = await server.executeOperation({
    query: `query { ${definitions(bookTable).queries.findMany.name()} {
      title
      
    }}`,
    variables: {},
  });
  console.log(JSON.stringify(result.errors));
  console.log(await client.query(q.Collection(bookTable.id)));
  // await client.query(q.Delete(q.Database(test_db_name)));
  expect(result.errors).toBeUndefined();
  expect(2 + 2).toBe(4);
});
