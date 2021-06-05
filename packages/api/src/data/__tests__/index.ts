import { ApolloServer } from "apollo-server";
import { Client, query as q } from "faunadb";
import { getProjectSchema } from "../index";
import { GraphQLSchema } from "graphql";
import scaffold from "../fauna/scaffold";
import admin from "../fauna/admin";
import { definitions } from "../definitions";
import { Table } from "../types";

jest.setTimeout(30000);
test("Initial query should be empty", async () => {
  const test_db_name = "cnewtest_" + Date.now();

  const client = new Client({
    secret: "fnAEKpUbg1ACBTYHxtqayKNrCnnmgHLyWoSSlyvX",
  });

  const tables: Record<string, Omit<Table, "fields">> = {};

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

  tables["Books"] = await createTable({
    name: "Books",
    projectId,
  });
  tables["Authors"] = await createTable({
    name: "Authors",
    projectId,
  });

  await createScalarField({
    name: "title",
    tableId: tables["Books"].id,
    type: "String",
  });
  await createScalarField({
    name: "name",
    tableId: tables["Authors"].id,
    type: "String",
  });

  await createRelationshipField({
    name: "authors",
    backName: "books",
    to: tables["Authors"].id,
    tableId: tables["Books"].id,
  });

  const schema: GraphQLSchema = await getProjectSchema(test_client, projectId);
  const server = new ApolloServer({
    schema,
  });

  console.log(`query { ${definitions(tables["Books"]).queries.findMany.name()} {
      title
      authors {
        name
      }
    }}`);
  const queryName = definitions(tables["Books"]).queries.findMany.name();
  const result = await server.executeOperation({
    query: `query { ${queryName} {
        title

      }}`,
    variables: {},
  });
  expect(result.errors).toBeUndefined();
  expect((result.data || {})[queryName]).toEqual([]);
  console.log(await client.query(q.Collection(tables["Books"].id)));
  await client.query(q.Delete(q.Database(test_db_name)));

  expect(2 + 2).toBe(4);
});
test("fake", () => {
  expect(2 + 2).toBe(4);
});
