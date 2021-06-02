import {
  FaunaResponse,
  Field,
  FieldInput,
  OrganizationInput,
  ProjectInput,
  RelationshipFieldInput,
  ScalarField,
  ScalarFieldInput,
  TableInput,
} from "../types";
import { Client, Expr, query as q } from "faunadb";

export default (client: Client) => ({
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
  createScalarField: async (
    fieldObj: Omit<ScalarFieldInput, "apiName" | "tableRef"> & {
      tableId: string;
    }
  ): Promise<unknown> => {
    const fieldPayload: FieldInput = {
      ...fieldObj,
      apiName: fieldObj.name,
      tableRef: q.Ref(q.Collection("tables"), fieldObj.tableId),
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
  createRelationshipField: async (
    fieldObj: Omit<
      RelationshipFieldInput,
      "apiName" | "tableRef" | "relationshipRef" | "type"
    > & { tableId: string; to: string }
  ): Promise<{ [p: string]: unknown; id: string }> => {
    const fieldPayload: Omit<RelationshipFieldInput, "relationshipRef"> = {
      ...fieldObj,
      type: "Relation",
      apiName: fieldObj.name,
      tableRef: q.Ref(q.Collection("tables"), fieldObj.tableId),
    };

    const {
      data,
      ref: { id },
    } = await client.query<FaunaResponse>(
      q.Let(
        {
          relationship: q.Create(q.Collection("relationships"), {
            data: {
              A: q.Ref(q.Collection("tables"), fieldObj.tableId),
              B: q.Ref(q.Collection("tables"), fieldObj.to),
            },
          }),
        },
        q.Create(q.Collection("fields"), {
          data: {
            ...fieldPayload,
            relationshipRef: q.Select("ref", q.Var("relationship")),
          },
        })
      )
    );
    return { id, ...data };
  },
});
