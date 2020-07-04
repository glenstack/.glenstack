import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { useApolloClient, useMutation, gql } from "@apollo/client";
import {
  ForgotPasswordMutation,
  ForgotPasswordMutation_viewerCredentials_requestPasswordResetTokenForUsername_errors,
} from "./__generated__/ForgotPasswordMutation";
import { useDomain } from "../../providers/DomainProvider";

export type ForgotPasswordModalParams = {
  "Forgot Password": {
    username?: string;
  };
};

type ForgotPasswordModalRouteProp = RouteProp<
  ForgotPasswordModalParams,
  "Forgot Password"
>;

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPasswordMutation($host: String, $username: String) {
    viewerCredentials {
      requestPasswordResetTokenForUsername(
        input: { host: $host, username: $username }
      ) {
        viewerCredentials {
          id
        }
        errors {
          message
        }
      }
    }
  }
`;

export const ForgotPasswordModal = () => {
  const domain = useDomain();
  const { username: defaultUsername } = useRoute<
    ForgotPasswordModalRouteProp
  >().params;
  const [username, setUsername] = useState(defaultUsername || "");
  const [
    forgotPasswordMutation,
    { data, loading, error: unknownError, called },
  ] = useMutation<ForgotPasswordMutation>(FORGOT_PASSWORD_MUTATION);

  const success = !!data?.viewerCredentials
    ?.requestPasswordResetTokenForUsername?.viewerCredentials?.id;
  const canForgotPassword = !(loading || success);

  const forgotPassword = () => {
    if (canForgotPassword)
      forgotPasswordMutation({ variables: { host: domain, username } });
  };

  return (
    <View>
      {data?.viewerCredentials?.requestPasswordResetTokenForUsername?.errors?.map(
        (error) =>
          error && <Text key={JSON.stringify(error)}>{error.message}</Text>
      )}
      {unknownError && (
        <Text>An unknown error has occurred. Please try again.</Text>
      )}
      <Text>Email:</Text>
      <TextInput
        value={username}
        onChangeText={(value) => setUsername(value)}
        autoFocus={true}
        autoCompleteType="email"
        textContentType="emailAddress"
        accessibilityLabel="Username"
        keyboardType="email-address"
        autoCapitalize="none"
        onSubmitEditing={canForgotPassword ? forgotPassword : undefined}
      />
      <Button
        title="Forgot Password"
        disabled={!canForgotPassword}
        onPress={forgotPassword}
      />
      {success && <Text>Success! Check your inbox.</Text>}
    </View>
  );
};
