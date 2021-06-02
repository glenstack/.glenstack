import { Expr, values } from "faunadb";
import Ref = values.Ref;
// import { FieldOptionsFromKind } from "@giraphql/core";
export interface FaunaSchema {
  [tableName: string]: Table;
}

export interface OrganizationInput {
  name: string;
  apiName: string;
}
export type ProjectInput = {
  name: string;
  apiName: string;
  organizationRef: Expr;
};

export interface TableInput {
  name: string;
  apiName: string;
  projectRef: Expr;
}
export type FieldInput = ScalarFieldInput | RelationshipFieldInput;

export interface ScalarFieldInput {
  name: string;
  apiName: string;
  type: "String" | "Boolean";
  tableRef: Expr;
}

export interface RelationshipFieldInput {
  name: string;
  apiName: string;
  relationshipRef: Ref;
  type: "Relation";
  tableRef: Expr;
  to: Expr;
}

export interface FaunaResponse {
  ref: Ref;
  ts: number;
  data: Record<string, unknown>;
}
export interface Table {
  name: string;
  apiName: string;
  fields: {
    [fieldName: string]: Field;
  };
  id: string;
}
export interface Project {
  name: string;
  apiName: string;
  organizationRef: Ref;
}

export type Field = ScalarField | RelationshipField;

export interface ScalarField {
  id: string;
  name: string;
  apiName: string;
  type: "String" | "Boolean";
  tableRef: Ref;
}

export interface RelationshipField {
  id: string;
  name: string;
  apiName: string;
  relationshipRef: Ref;
  type: "Relation";
  relationship: { A: Ref; B: Ref };
  relationKey: "A" | "B";
  to: Ref;
}
