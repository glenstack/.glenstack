/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CourseListQuery
// ====================================================

export interface CourseListQuery_viewer {
  __typename: "Viewer";
  username: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface CourseListQuery_registrations_edges_node_course {
  __typename: "Course";
  title: string;
}

export interface CourseListQuery_registrations_edges_node {
  __typename: "Registration";
  id: string;
  course: CourseListQuery_registrations_edges_node_course | null;
}

export interface CourseListQuery_registrations_edges {
  __typename: "RegistrationEdge";
  node: CourseListQuery_registrations_edges_node | null;
}

export interface CourseListQuery_registrations {
  __typename: "RegistrationConnection";
  edges: (CourseListQuery_registrations_edges | null)[] | null;
}

export interface CourseListQuery {
  viewer: CourseListQuery_viewer | null;
  registrations: CourseListQuery_registrations | null;
}
