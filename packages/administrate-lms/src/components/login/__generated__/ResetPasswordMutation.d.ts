/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResetPasswordMutation
// ====================================================

export interface ResetPasswordMutation_viewerCredentials_resetPassword_viewerCredentials {
  __typename: "ViewerCredentials";
  id: string | null;
}

export interface ResetPasswordMutation_viewerCredentials_resetPassword_errors {
  __typename: "FieldError";
  message: string | null;
}

export interface ResetPasswordMutation_viewerCredentials_resetPassword {
  __typename: "ViewerCredentialsMutationsResponseType";
  viewerCredentials: ResetPasswordMutation_viewerCredentials_resetPassword_viewerCredentials | null;
  errors: (ResetPasswordMutation_viewerCredentials_resetPassword_errors | null)[] | null;
}

export interface ResetPasswordMutation_viewerCredentials {
  __typename: "ViewerCredentialsMutations";
  resetPassword: ResetPasswordMutation_viewerCredentials_resetPassword | null;
}

export interface ResetPasswordMutation {
  viewerCredentials: ResetPasswordMutation_viewerCredentials | null;
}

export interface ResetPasswordMutationVariables {
  password?: string | null;
  passwordResetToken?: string | null;
}
