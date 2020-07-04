/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ForgotPasswordMutation
// ====================================================

export interface ForgotPasswordMutation_viewerCredentials_requestPasswordResetTokenForUsername_viewerCredentials {
  __typename: "ViewerCredentials";
  id: string | null;
}

export interface ForgotPasswordMutation_viewerCredentials_requestPasswordResetTokenForUsername_errors {
  __typename: "FieldError";
  message: string | null;
}

export interface ForgotPasswordMutation_viewerCredentials_requestPasswordResetTokenForUsername {
  __typename: "ViewerCredentialsMutationsResponseType";
  viewerCredentials: ForgotPasswordMutation_viewerCredentials_requestPasswordResetTokenForUsername_viewerCredentials | null;
  errors: (ForgotPasswordMutation_viewerCredentials_requestPasswordResetTokenForUsername_errors | null)[] | null;
}

export interface ForgotPasswordMutation_viewerCredentials {
  __typename: "ViewerCredentialsMutations";
  requestPasswordResetTokenForUsername: ForgotPasswordMutation_viewerCredentials_requestPasswordResetTokenForUsername | null;
}

export interface ForgotPasswordMutation {
  viewerCredentials: ForgotPasswordMutation_viewerCredentials | null;
}

export interface ForgotPasswordMutationVariables {
  host?: string | null;
  username?: string | null;
}
