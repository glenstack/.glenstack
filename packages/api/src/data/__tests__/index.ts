import { ApolloServer } from "apollo-server";
import { Client, query as q } from "faunadb";
import { getSchema } from "../index";
import { GraphQLSchema } from "graphql";
import scaffold from "../fauna/scaffold";
import admin from "../fauna/admin";
import { definitions } from "../definitions";
import { Table } from "../types";

jest.setTimeout(30000);

const test_db_name = "cnewtest_" + Date.now();

const client = new Client({
  secret: "fnAEKpUbg1ACBTYHxtqayKNrCnnmgHLyWoSSlyvX",
});
let test_client: Client;

let server: ApolloServer;

let tables: Record<string, Omit<Table, "fields">>;

beforeAll(async () => {
  await client.query(q.CreateDatabase({ name: test_db_name }));

  const { secret }: { secret: string } = await client.query(
    q.CreateKey({
      database: q.Database(test_db_name),
      role: "server",
    })
  );
  test_client = new Client({
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

  const schema: GraphQLSchema = await getSchema(test_client);
  server = new ApolloServer({
    schema,
  });
});

test("Initial query should be empty", async () => {
  console.log(`query { ${definitions(tables["Books"]).queries.findMany.name()} {
      title
      authors {
        name
      }
    }}`);
  // const tables =
  const result = await server.executeOperation({
    query: `query { ${definitions(tables["Books"]).queries.findMany.name()} {
        title
        
      }}`,
    variables: {},
  });
  expect(result.errors).toBeUndefined();
  expect(result.data).toBe([]);
  console.log(await client.query(q.Collection(tables["Books"].id)));
  // await client.query(q.Delete(q.Database(test_db_name)));

  expect(2 + 2).toBe(4);
});
