import { ApolloServer } from "apollo-server";
import { Client, query as q } from "faunadb";
import { getProjectSchema } from "../index";
import { GraphQLSchema } from "graphql";
import scaffold from "../fauna/scaffold";
import repositories from "../fauna/repositories";
import { definitions } from "../definitions";

jest.setTimeout(30000);
test("Integration Test", async () => {
  const test_db_name = "altest_" + Date.now();

  const client = new Client({
    secret: "fnAEKpUbg1ACBTYHxtqayKNrCnnmgHLyWoSSlyvX",
  });

  const tables: Record<string, { name: string; apiName: string; id: string }> =
    {
      Book: { id: "", name: "Book", apiName: "Book" },
      Author: { id: "", name: "Author", apiName: "Author" },
    };

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

  const { organization, project, table, scalarField, relationshipField } =
    repositories(test_client);
  await scaffold(test_client);

  const organizationId = await organization.create({
    name: "LibraryOrg",
    apiName: "LibraryOrg",
  });
  const projectId = await project.create({
    name: "LibraryProj",
    apiName: "LibraryProj",
    organizationId,
  });

  for (const [key, value] of Object.entries(tables)) {
    tables[key].id = await table.create({
      ...value,
      projectId,
    });
  }

  await scalarField.create({
    name: "title",
    apiName: "title",
    tableId: tables["Book"].id,
    type: "String",
  });
  await scalarField.create({
    name: "name",
    apiName: "name",
    tableId: tables["Author"].id,
    type: "String",
  });

  await relationshipField.create({
    name: "authors",
    apiName: "authors",
    backName: "books",
    apiBackName: "books",
    to: tables["Author"].id,
    tableId: tables["Book"].id,
  });

  const schema: GraphQLSchema = await getProjectSchema(test_client, projectId);
  const server = new ApolloServer({
    schema,
  });

  /**
   * First query should return empty array
   */

  let queryName = definitions(tables["Book"]).queries.findMany.name();
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

  queryName = definitions(tables["Book"]).queries.createOne.name();
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

  queryName = definitions(tables["Author"]).queries.createOne.name();
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
