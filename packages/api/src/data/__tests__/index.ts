import { ApolloServer } from "apollo-server";
import { Client, query as q } from "faunadb";
import { getProjectSchema } from "../index";
import { GraphQLSchema } from "graphql";
import scaffold from "../fauna/scaffold";
import repositories from "../fauna/repositories";
import { definitions } from "../definitions";

jest.setTimeout(30000);
test("Integration Test", async () => {
  const test_db_name = "test_" + Date.now();

  if (!process.env.FAUNA_INTEGRATION_TEST_KEY) {
    throw new Error("Missing env 'FAUNA_INTEGRATION_TEST_KEY'");
  }

  const client = new Client({
    secret: process.env.FAUNA_INTEGRATION_TEST_KEY,
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
  expect(
    organization.create({
      name: "ABC",
      apiName: "LibraryOrg",
    })
  ).rejects.toThrow(/already exists/);

  const projectId = await project.create({
    name: "WrongName",
    apiName: "WrongApiName",
    organizationId,
  });
  await project.update(projectId, {
    name: "LibraryProj",
    apiName: "LibraryProj",
    organizationId,
  });

  expect(project.get(projectId)).resolves.toHaveProperty(
    "apiName",
    "LibraryProj"
  );

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

  const [authorsFieldId, booksFieldId] =
    await relationshipField.createBidirectional({
      name: "authors",
      apiName: "wrongAuthors",
      backName: "books",
      backApiName: "wrongBooks",
      to: tables["Author"].id,
      tableId: tables["Book"].id,
    });

  /**
   * If the relationship fields do not update correctly then the GraphQL queries after will automatically fail
   */
  await relationshipField.update(authorsFieldId, { apiName: "authors" });
  await relationshipField.update(booksFieldId, { apiName: "books" });

  const schema: GraphQLSchema = await getProjectSchema(test_client, projectId);
  const server = new ApolloServer({
    schema,
  });

  /**
   * First query should return empty array
   */

  let queryName = definitions.queries(tables["Book"]).findMany.name();
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

  queryName = definitions.queries(tables["Book"]).createOne.name();
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

  queryName = definitions.queries(tables["Author"]).createOne.name();
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
