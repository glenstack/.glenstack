import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { ResetPasswordMutation } from "./__generated__/ResetPasswordMutation";
import { TextInput } from "react-native-gesture-handler";
import { RouteProp, useRoute } from "@react-navigation/native";

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation(
    $password: String
    $passwordResetToken: String
  ) {
    viewerCredentials {
      resetPassword(
        input: { password: $password, passwordResetToken: $passwordResetToken }
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

export type ResetPasswordModalParams = {
  "Reset Password": {
    passwordResetToken: string;
  };
};

type ResetPasswordModalRouteProp = RouteProp<
  ResetPasswordModalParams,
  "Reset Password"
>;

// TODO: Only really possible if we get first-party support from Administrate, since it will rely on redirecting from https://${domain}/forgot/${passwordResetToken}.

export const ResetPasswordModal = () => {
  const { passwordResetToken } = useRoute<ResetPasswordModalRouteProp>().params;
  const [
    resetPasswordMutation,
    { data, loading, error: unknownError },
  ] = useMutation<ResetPasswordMutation>(RESET_PASSWORD_MUTATION);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch = password === confirmPassword;
  const success = !!data?.viewerCredentials?.resetPassword?.viewerCredentials
    ?.id;
  const canResetPassword = passwordsMatch && !(loading || success);

  const resetPassword = () => {
    if (canResetPassword)
      resetPasswordMutation({ variables: { password, passwordResetToken } });
  };

  return (
    <View>
      {data?.viewerCredentials?.resetPassword?.errors?.map(
        (error) =>
          error && <Text key={JSON.stringify(error)}>{error.message}</Text>
      )}
      {unknownError && (
        <Text>An unknown error has occurred. Please try again.</Text>
      )}
      {!passwordsMatch && <Text>Passwords do not match.</Text>}
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={(value) => setPassword(value)}
        autoCompleteType="password"
        textContentType="newPassword"
        accessibilityLabel="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        returnKeyType="next"
      />
      <Text>Confirm Password:</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={(value) => setConfirmPassword(value)}
        autoCompleteType="password"
        textContentType="newPassword"
        accessibilityLabel="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        onSubmitEditing={canResetPassword ? resetPassword : undefined}
      />
      <Button
        title="Reset Password"
        disabled={!canResetPassword}
        onPress={resetPassword}
      />
      {success && <Text>Success! You may now login.</Text>}
    </View>
  );
};
