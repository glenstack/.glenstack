import React from "react";
import { View, Text, Button } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { RegistrationQuery } from "./__generated__/RegistrationQuery";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";

const REGISTRATION_QUERY = gql`
  query RegistrationQuery($registrationID: String) {
    registrations(
      filters: [{ field: id, operation: eq, value: $registrationID }]
    ) {
      edges {
        node {
          id
          course {
            id
            title
            content(learnerId: $registrationID) {
              edges {
                node {
                  __typename
                  id
                  order
                  type
                  ... on ExternalActivity {
                    externalActivityInstructions
                    externalActivityUrl
                  }
                  ... on Document {
                    name
                    identifyingHash
                    fileSize
                  }
                  ... on Video {
                    name
                    wistiaVideoId
                    fileSize
                  }
                  ... on Scorm {
                    name
                    identifyingHash
                    entrypoint
                    version
                    fileSize
                    maxAttempts
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export type RegistrationParams = {
  Registration: {
    registrationID: string;
  };
};

type RegistrationRouteProp = RouteProp<RegistrationParams, "Registration">;

export const Registration = () => {
  const navigation = useNavigation();
  const { registrationID } = useRoute<RegistrationRouteProp>().params;
  const { loading, error, data } = useQuery<RegistrationQuery>(
    REGISTRATION_QUERY,
    {
      variables: { registrationID },
    }
  );

  // TOOD: Loading & error states
  if (error) return <Text>Error: {error}</Text>;

  if (loading) return <Text>Loading...</Text>;

  const registration = data?.registrations?.edges?.find(() => true)?.node;
  const courseContent = registration?.course?.content?.edges || [];

  return (
    <View>
      <Text>{registration?.course?.title}</Text>
      {courseContent.map((content) => {
        const node = content?.node;
        if (node)
          if (node.__typename === "ExternalActivity") {
            return (
              <Button
                key={JSON.stringify(node)}
                title={`${node.externalActivityInstructions}`}
                onPress={() => {}}
              />
            );
          } else if ("name" in node) {
            return (
              <Button
                key={JSON.stringify(node)}
                title={`${node.name}`}
                onPress={() =>
                  navigation.navigate("Content Viewer", {
                    registrationID,
                    contentID: node.id,
                  })
                }
              />
            );
          }
      })}
    </View>
  );
};
