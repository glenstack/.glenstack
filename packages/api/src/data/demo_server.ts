import { ApolloServer } from "apollo-server";

import { Client } from "faunadb";
import { getProjectSchema } from "./index";
import { GraphQLSchema } from "graphql";
// import scaffold from "./fauna/scaffold";
import repositories from "./fauna/repositories";

(async () => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Demo server should not be run in production");
  }
  if (!process.env.FAUNA_ADMIN_KEY) {
    throw new Error("Missing env 'FAUNA_ADMIN_KEY'");
  }

  const client = new Client({
    secret: process.env.FAUNA_ADMIN_KEY,
  });

  const tables: Record<string, { name: string; apiName: string; id: string }> =
    {
      Book: { id: "", name: "Book", apiName: "Book" },
      Author: { id: "", name: "Author", apiName: "Author" },
    };
  let projectId = process.env.DEMO_PROJECT_ID;
  if (!projectId) {
    const { organization, project, table, scalarField, relationshipField } =
      repositories(client);
    // await scaffold(client);

    const organizationId = await organization.create({
      name: "LibraryOrg",
      apiName: "LibraryOrg",
    });

    projectId = await project.create({
      name: "WrongName",
      apiName: "WrongApiName",
      organizationId,
    });
    await project.update(projectId, {
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
      name: "pubYear",
      apiName: "pubYear",
      tableId: tables["Book"].id,
      type: "Number",
    });
    await scalarField.create({
      name: "jsonDescription",
      apiName: "jsonDescription",
      tableId: tables["Book"].id,
      type: "JSON",
    });
    await scalarField.create({
      name: "name",
      apiName: "name",
      tableId: tables["Author"].id,
      type: "String",
    });
    await scalarField.create({
      name: "emails",
      apiName: "emails",
      tableId: tables["Author"].id,
      type: ["EmailAddress"],
    });

    // const [authorsFieldId, booksFieldId] =
    await relationshipField.createBidirectional({
      name: "authors",
      apiName: "authors",
      backName: "books",
      backApiName: "books",
      to: tables["Author"].id,
      tableId: tables["Book"].id,
    });
  }

  getProjectSchema(client, projectId).then(async (schema: GraphQLSchema) => {
    const server = new ApolloServer({
      schema,
      cors: {
        origin: "*",
      },
    });
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  });
})();
