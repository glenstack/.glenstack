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
export interface Project {
  name: string;
  apiName: string;
  organizationRef: Ref;
}
export type ProjectInput = Omit<Project, "organizationRef"> & {
  organizationRef: Expr;
};

export interface TableInput {
  name: string;
  apiName: string;
  projectRef: Expr;
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
    [fieldName: string]: Field | RelationshipField;
  };
  collectionName: string;
}

export type Field = ScalarField | RelationshipField;

export interface ScalarField {
  name: string;
  apiName: string;
  type: "String" | "Boolean";
  tableRef: Expr;
  isRelation?: false;
}

export interface RelationshipField {
  name: string;
  apiName: string;
  relationshipRef: Ref;
  isRelation: true;
  from: "A" | "B";
  to: "A" | "B";
}