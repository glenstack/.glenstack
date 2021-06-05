import { Client, query as q } from "faunadb";

export default async (client: Client): Promise<void> => {
  await client.query(q.CreateCollection({ name: "organizations" }));
  await client.query(q.CreateCollection({ name: "projects" }));
  await client.query(q.CreateCollection({ name: "tables" }));
  await client.query(q.CreateCollection({ name: "fields" }));
  await client.query(q.CreateCollection({ name: "relations" }));
  await client.query(q.CreateCollection({ name: "relationships" }));
  console.log(await client.query(q.Exists(q.Collection("projects"))));

  await client.query(
    q.CreateIndex({
      name: "projects_by_organization",
      unique: false,
      serialized: true,
      source: q.Collection("projects"),
      terms: [
        {
          field: ["data", "organizationRef"],
        },
      ],
    })
  );
  await client.query(
    q.CreateIndex({
      name: "fields_by_table",
      unique: false,
      serialized: true,
      source: q.Collection("fields"),
      terms: [
        {
          field: ["data", "tableRef"],
        },
      ],
    })
  );
  await client.query(
    q.CreateIndex({
      name: "tables_by_project",
      unique: false,
      serialized: true,
      source: q.Collection("tables"),
      terms: [
        {
          field: ["data", "projectRef"],
        },
      ],
    })
  );
  await client.query(
    q.CreateIndex({
      name: "relationsA",
      unique: false,
      serialized: true,
      source: q.Collection("relations"),
      terms: [
        {
          field: ["data", "relationshipRef"],
        },
        {
          field: ["data", "A"],
        },
      ],
      values: [
        {
          field: ["data", "B"],
        },
      ],
    })
  );
  await client.query(
    q.CreateIndex({
      name: "relationsB",
      unique: false,
      serialized: true,
      source: q.Collection("relations"),
      terms: [
        {
          field: ["data", "relationshipRef"],
        },
        {
          field: ["data", "B"],
        },
      ],
      values: [
        {
          field: ["data", "A"],
        },
      ],
    })
  );
};
