/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Version } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: RegistrationQuery
// ====================================================

export interface RegistrationQuery_registrations_edges_node_course_content_edges_node_Separator {
  __typename: "Separator";
  id: string | null;
  order: number | null;
  type: string | null;
}

export interface RegistrationQuery_registrations_edges_node_course_content_edges_node_ExternalActivity {
  __typename: "ExternalActivity";
  id: string | null;
  order: number | null;
  type: string | null;
  externalActivityInstructions: string | null;
  externalActivityUrl: string | null;
}

export interface RegistrationQuery_registrations_edges_node_course_content_edges_node_Document {
  __typename: "Document";
  id: string | null;
  order: number | null;
  type: string | null;
  name: string | null;
  identifyingHash: string | null;
  fileSize: number | null;
}

export interface RegistrationQuery_registrations_edges_node_course_content_edges_node_Video {
  __typename: "Video";
  id: string | null;
  order: number | null;
  type: string | null;
  name: string | null;
  wistiaVideoId: string | null;
  fileSize: number | null;
}

export interface RegistrationQuery_registrations_edges_node_course_content_edges_node_Scorm {
  __typename: "Scorm";
  id: string | null;
  order: number | null;
  type: string | null;
  name: string | null;
  identifyingHash: string | null;
  entrypoint: string | null;
  version: Version | null;
  fileSize: number | null;
  maxAttempts: number | null;
}

export type RegistrationQuery_registrations_edges_node_course_content_edges_node = RegistrationQuery_registrations_edges_node_course_content_edges_node_Separator | RegistrationQuery_registrations_edges_node_course_content_edges_node_ExternalActivity | RegistrationQuery_registrations_edges_node_course_content_edges_node_Document | RegistrationQuery_registrations_edges_node_course_content_edges_node_Video | RegistrationQuery_registrations_edges_node_course_content_edges_node_Scorm;

export interface RegistrationQuery_registrations_edges_node_course_content_edges {
  __typename: "ContentEdge";
  node: RegistrationQuery_registrations_edges_node_course_content_edges_node | null;
}

export interface RegistrationQuery_registrations_edges_node_course_content {
  __typename: "ContentConnection";
  edges: (RegistrationQuery_registrations_edges_node_course_content_edges | null)[] | null;
}

export interface RegistrationQuery_registrations_edges_node_course {
  __typename: "Course";
  id: string;
  title: string;
  content: RegistrationQuery_registrations_edges_node_course_content | null;
}

export interface RegistrationQuery_registrations_edges_node {
  __typename: "Registration";
  id: string;
  course: RegistrationQuery_registrations_edges_node_course | null;
}

export interface RegistrationQuery_registrations_edges {
  __typename: "RegistrationEdge";
  node: RegistrationQuery_registrations_edges_node | null;
}

export interface RegistrationQuery_registrations {
  __typename: "RegistrationConnection";
  edges: (RegistrationQuery_registrations_edges | null)[] | null;
}

export interface RegistrationQuery {
  registrations: RegistrationQuery_registrations | null;
}

export interface RegistrationQueryVariables {
  registrationID?: string | null;
}
