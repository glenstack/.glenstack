import React from "react";
import { Text, View, TextInput } from "../base";
import { gql, useQuery } from "@apollo/client";
import { ProfileQuery } from "./__generated__/ProfileQuery";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { TabsWithDescription } from "../tabsWithDescription/tabsWithDescription"
import { CardSettings } from "../cardSettings/cardSettings"
import { CourseItem } from "../courseItem/courseItem"

const PROFILE_QUERY = gql`
  query RegistrationQuery($registrationID: String) {
    registrations(
      filters: [{ field: id, operation: eq, value: $registrationID }]
    ) {
      edges {
        node {
          id
          completedPiecesOfContent
          totalPiecesOfContent
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

type ProfileRouteProp = RouteProp<{}, "Profile">;

export const Profile = () => {
  const tabTitles = ["Profile"];

  const navigation = useNavigation();

  return (
    <View>
      <TabsWithDescription title="Profile" subtitle="" tabTitles={tabTitles} selectedTitle={0}></TabsWithDescription>
      <View className="m-6">
        <CardSettings title="Personal Details" subtitle="First Name" content="Athena"/>
      </View>
      <View className="m-6">
        <CardSettings title="Language" subtitle="Engilish" content="something"/>
      </View>
      <View className="m-6">
        <CardSettings title="Login Details" subtitle="Username" content="something"/>
      </View>
    </View>
  );
};
