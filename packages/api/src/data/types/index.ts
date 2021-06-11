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
export interface Organization {
  id: string;
  name: string;
  apiName: string;
}
export type ProjectInput = {
  name: string;
  apiName: string;
  organizationRef: Expr;
};
export interface Project {
  name: string;
  apiName: string;
  organizationRef: Ref;
}

export interface TableInput {
  name: string;
  apiName: string;
  projectRef: Expr;
}
export type FieldInput = ScalarFieldInput | RelationshipFieldInput;

export interface ScalarFieldInput {
  name: string;
  apiName: string;
  type: "String" | "Boolean" | "Number";
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

export interface FaunaResponse<Type = Record<string, unknown>> {
  ref: Ref;
  ts: number;
  data: Type;
}
export interface Table {
  name: string;
  apiName: string;
  fields: {
    [fieldName: string]: Field;
  };
  id: string;
}

export type Field = ScalarField | RelationshipField;

export interface ScalarField {
  id: string;
  name: string;
  apiName: string;
  type: "String" | "Boolean" | "Number";
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

// export interface IWrite<T> {
//   create(item: T): Promise<boolean>;
//   update(id: string, item: T): Promise<boolean>;
//   delete(id: string): Promise<boolean>;
// }

// export interface IRead<T> {
//   find(item: T): Promise<T[]>;
//   findOne(id: string): Promise<T>;
// }

export interface IRepository<I> {
  create(item: I): Promise<string>;
  // update(id: string, item: T): Promise<boolean>;
  // delete(id: string): Promise<boolean>;
}
// export interface EntityBase
// {
//    public int Id { get; protected set; }
// }
