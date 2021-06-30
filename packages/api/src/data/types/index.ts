import { Expr, values } from "faunadb";
import { GraphQLScalarType } from "graphql/type";
import Ref = values.Ref;
// import { FieldOptionsFromKind } from "@giraphql/core";

export declare class Stringified<T> extends String {
  private ___stringified: T;
}

export interface JSON {
  stringify<T>(
    value: T,
    replacer?: (key: string, value: unknown) => unknown,
    space?: string | number
  ): string & Stringified<T>;
  parse<T>(
    text: Stringified<T>,
    reviver?: (key: unknown, value: unknown) => unknown
  ): T;
  parse(
    text: string,
    reviver?: (key: unknown, value: unknown) => unknown
  ): unknown;
}

export interface FaunaSchema {
  [tableName: string]: Omit<Table, "fields"> & {
    fields: {
      [fieldName: string]: Field;
    };
  };
}

export interface GiraphQLSchemaTypes {
  DefaultFieldNullability: true;
  Scalars: {
    Number: {
      Input: number;
      Output: number;
    };
    EmailAddress: {
      Input: GraphQLScalarType;
      Output: GraphQLScalarType;
    };
    JSON: {
      Input: GraphQLScalarType;
      Output: GraphQLScalarType;
    };
  };
}
export type TypesWithDefaults =
  GiraphQLSchemaTypes.ExtendDefaultTypes<GiraphQLSchemaTypes>;
export interface Organization<ProjectType = Project> {
  id: string;
  name: string;
  apiName: string;
  projects: Array<ProjectType>;
}

export type OrganizationInput = Omit<Organization, "id" | "projects">;

export interface Project {
  id: string;
  name: string;
  apiName: string;
  organizationRef: Ref;
  tables: Array<Table>;
}

export type ProjectInput = Omit<
  Project,
  "id" | "organizationRef" | "tables"
> & {
  organizationRef: Expr;
};

export interface FaunaResponse<Type = Record<string, unknown>> {
  ref: Ref;
  ts: number;
  data: Type;
}
export interface Table {
  name: string;
  apiName: string;
  fields: Array<Field>;
  id: string;
  projectRef: Ref;
}

export type TableInput = Pick<Table, "name" | "apiName"> & {
  projectRef: Expr;
};

export type Field = ScalarField | RelationshipField;

export type ScalarType =
  | "String"
  | "Boolean"
  | "Number"
  | "EmailAddress"
  | "JSON";

export interface ScalarField {
  id: string;
  name: string;
  apiName: string;
  type: ScalarType | [ScalarType];
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
  tableRef: Ref;
}

export type ScalarFieldInput = Omit<ScalarField, "tableRef" | "id"> & {
  tableRef: Expr;
};

export type RelationshipFieldInput = Pick<
  RelationshipField,
  "name" | "apiName" | "type" | "relationshipRef"
> & { tableRef: Expr; to: Expr };

export type FieldInput = ScalarFieldInput | RelationshipFieldInput;

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
