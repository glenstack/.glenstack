import { ApolloServer } from "apollo-server";
import { Client, query as q } from "faunadb";
import { getProjectSchema } from "../index";
import { GraphQLSchema } from "graphql";
import scaffold from "../fauna/scaffold";
import admin from "../fauna/admin";
import { definitions } from "../definitions";
import { Table } from "../types";

jest.setTimeout(30000);
test("Integration Test", async () => {
  const test_db_name = "test_" + Date.now();

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

  /**
   * First query should return empty array
   */

  let queryName = definitions(tables["Books"]).queries.findMany.name();
  let result = await server.executeOperation({
    query: `query { ${queryName} {
        id
        title
        authors {
          name
        }

      }}`,
    variables: {},
  });
  let data = (result.data || {})[queryName];
  expect(result.errors).toBeUndefined();
  expect(data).toEqual([]);

  /**
   * Create single book and expect that book in the response.
   */

  queryName = definitions(tables["Books"]).queries.createOne.name();
  result = await server.executeOperation({
    query: `mutation ($title: String!) { ${queryName} (input: {title: $title}) {
        id
        title
        authors {
          name
        }

      }}`,
    variables: { title: "The Kite Runner" },
  });
  data = (result.data || {})[queryName];
  expect(result.errors).toBeUndefined();
  expect(typeof data).toEqual("object");
  expect({ title: data.title, authors: data.authors }).toEqual({
    title: "The Kite Runner",
    authors: [],
  });

  const kiteRunnerId = data.id;

  /**
   * Create single author of that book and expect that author with the right book in the response.
   */

  queryName = definitions(tables["Authors"]).queries.createOne.name();
  result = await server.executeOperation({
    query: `mutation ($name: String!, $connect: [ID!]!) { ${queryName} (input: {name: $name, books: {connect: $connect}}) {
        id
        name
        books {
          id
          title
        }

      }}`,
    variables: { name: "Khaled", connect: [kiteRunnerId] },
  });
  data = (result.data || {})[queryName];
  expect(result.errors).toBeUndefined();
  expect(typeof data).toEqual("object");
  expect(data.books.length).toEqual(1);
  expect(data.books[0].id).toEqual(kiteRunnerId);

  await client.query(q.Delete(q.Database(test_db_name)));
});
