import { Client, query as q } from "faunadb";

export default async (client: Client): Promise<void> => {
  await client.query(
    q.CreateCollection({ name: "organizations", history_days: null })
  );
  await client.query(
    q.CreateCollection({ name: "projects", history_days: null })
  );
  await client.query(
    q.CreateCollection({ name: "tables", history_days: null })
  );
  await client.query(
    q.CreateCollection({ name: "fields", history_days: null })
  );
  await client.query(
    q.CreateCollection({ name: "relations", history_days: null })
  );
  await client.query(
    q.CreateCollection({ name: "relationships", history_days: null })
  );
  console.log(await client.query(q.Exists(q.Collection("relations"))));
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
      name: "relations_A",
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
      name: "relations_B",
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

  /**
   * Indices for uniqueness constraints
   */

  await client.query(
    q.CreateIndex({
      name: "organizations_apiName_unique",
      unique: true,
      serialized: true,
      source: q.Collection("organizations"),
      terms: [
        {
          field: ["data", "apiName"],
        },
      ],
    })
  );
  await client.query(
    q.CreateIndex({
      name: "projects_apiName_unique",
      unique: true,
      serialized: true,
      source: q.Collection("projects"),
      terms: [
        {
          field: ["data", "organizationRef"],
        },
        {
          field: ["data", "apiName"],
        },
      ],
    })
  );
  await client.query(
    q.CreateIndex({
      name: "tables_apiName_unique",
      unique: true,
      serialized: true,
      source: q.Collection("projects"),
      terms: [
        {
          field: ["data", "projectRef"],
        },
        {
          field: ["data", "apiName"],
        },
      ],
    })
  );
  await client.query(
    q.CreateIndex({
      name: "fields_apiName_unique",
      unique: true,
      serialized: true,
      source: q.Collection("fields"),
      terms: [
        {
          field: ["data", "tableRef"],
        },
        {
          field: ["data", "apiName"],
        },
      ],
    })
  );
  await client.query(
    q.CreateIndex({
      name: "relations_unique",
      unique: true,
      serialized: true,
      source: q.Collection("relations"),
      terms: [
        {
          field: ["data", "relationshipRef"],
        },
        {
          field: ["data", "A"],
        },
        {
          field: ["data", "B"],
        },
      ],
    })
  );
};
