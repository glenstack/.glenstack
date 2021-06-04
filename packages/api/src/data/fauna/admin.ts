import {
  FaunaResponse,
  FieldInput,
  OrganizationInput,
  ProjectInput,
  RelationshipFieldInput,
  ScalarFieldInput,
  TableInput,
} from "../types";
import { Client, query as q } from "faunadb";

//TODO: Genereate apiNames automatically by camelcasing string

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (client: Client): Record<string, any> => ({
  createOrganization: async ({
    name,
  }: {
    name: string;
  }): Promise<{ [p: string]: unknown; id: string }> => {
    const organizationInput: OrganizationInput = { name, apiName: name };

    const {
      data,
      ref: { id },
    } = await client.query<FaunaResponse>(
      q.Create(q.Collection("organizations"), {
        data: {
          ...organizationInput,
        },
      })
    );
    return { id, ...data };
  },

  createProject: async ({
    organizationId,
    name,
  }: {
    organizationId: string;
    name: string;
  }): Promise<{ [p: string]: unknown; id: string }> => {
    const projectInput: ProjectInput = {
      name,
      apiName: name,
      organizationRef: q.Ref(q.Collection("organizations"), organizationId),
    };
    const {
      data,
      ref: { id },
    } = await client.query<FaunaResponse>(
      q.Create(q.Collection("projects"), {
        data: { ...projectInput },
      })
    );
    return { id, ...data };
  },
  createTable: async ({
    projectId,
    name,
  }: {
    projectId: string;
    name: string;
  }): Promise<{ [p: string]: unknown; id: string }> => {
    const tableInput: TableInput = {
      name,
      apiName: name,
      projectRef: q.Ref(q.Collection("projects"), projectId),
    };
    const {
      data,
      ref: { id },
    } = await client.query<FaunaResponse>(
      q.Create(q.Collection("tables"), {
        data: { ...tableInput },
      })
    );
    await client.query(q.CreateCollection({ name: id }));
    return { id, ...data };
  },
  createScalarField: async ({
    tableId,
    ...fieldObj
  }: Omit<ScalarFieldInput, "apiName" | "tableRef"> & {
    tableId: string;
  }): Promise<{
    [p: string]: unknown;
    id: string;
  }> => {
    const fieldPayload: FieldInput = {
      ...fieldObj,
      apiName: fieldObj.name,
      tableRef: q.Ref(q.Collection("tables"), tableId),
    };

    const {
      data,
      ref: { id },
    } = await client.query<FaunaResponse>(
      q.Create(q.Collection("fields"), {
        data: { ...fieldPayload },
      })
    );
    return { id, ...data };
  },
  createRelationshipField: async ({
    tableId,
    backName, // Name of the field that references back to the created relational field
    ...fieldObj
  }: Omit<
    RelationshipFieldInput,
    "apiName" | "tableRef" | "relationshipRef" | "type"
  > & { tableId: string; to: string; backName: string }): Promise<{
    [p: string]: unknown;
    id: string;
  }> => {
    const fieldPayload: Omit<RelationshipFieldInput, "relationshipRef"> = {
      ...fieldObj,
      to: q.Ref(q.Collection("tables"), fieldObj.to),
      type: "Relation",
      apiName: fieldObj.name,
      tableRef: q.Ref(q.Collection("tables"), tableId),
    };
    const backFieldPayload: Omit<RelationshipFieldInput, "relationshipRef"> = {
      type: "Relation",
      name: backName,
      apiName: backName,
      to: q.Ref(q.Collection("tables"), tableId),
      tableRef: q.Ref(q.Collection("tables"), fieldObj.to),
    };

    const {
      data,
      ref: { id },
    } = await client.query<FaunaResponse>(
      q.Let(
        {
          relationship: q.Create(q.Collection("relationships"), {
            data: {
              A: q.Ref(q.Collection("tables"), tableId),
              B: q.Ref(q.Collection("tables"), fieldObj.to),
            },
          }),
        },
        q.Do(
          q.Create(q.Collection("fields"), {
            data: {
              ...fieldPayload,
              relationshipRef: q.Select("ref", q.Var("relationship")),
            },
          }),
          q.Create(q.Collection("fields"), {
            data: {
              ...backFieldPayload,
              relationshipRef: q.Select("ref", q.Var("relationship")),
            },
          })
        )
      )
    );
    return { id, ...data };
  },
});
