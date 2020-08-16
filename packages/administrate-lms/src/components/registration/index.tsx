import React from "react";
import { Text, View } from "../base";
import { gql, useQuery } from "@apollo/client";
import { RegistrationQuery } from "./__generated__/RegistrationQuery";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { TabsWithDescription } from "../tabsWithDescription/tabsWithDescription"
import { ProgressBar } from "../progressBar/progressBar"
import { CourseItem } from "../courseItem/courseItem"

const REGISTRATION_QUERY = gql`
  query RegistrationQuery($registrationID: String) {
    registrations(
      filters: [{ field: id, operation: eq, value: $registrationID }]
    ) {
      edges {
        node {
          id
          completedPiecesOfContent
          totalPiecesOfContent
          contentResults {
            edges {
              node {
                progress
                score
                attempts
                completedAttempts
                lastAccessed
                status
                id
                contentId
                ... on VideoContentResult {
                  startAt
                }
              }
            }
          }
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
  const tabTitles = ["Overview"];

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
  const progressions = registration?.contentResults?.edges || [];
  console.log("HERe")
  console.log(progressions)

  return (
    <View>
      <TabsWithDescription title="Administrate LMS" subtitle="Location: Concordia University" tabTitles={tabTitles} selectedTab="Overview"></TabsWithDescription>
      <View className="m-6">
        <ProgressBar numberOfStepsCompleted={registration.completedPiecesOfContent} numberOfSteps={registration.totalPiecesOfContent}/>
      </View>
      {courseContent.map((content) => {
        console.log(progressions[content?.node?.order]?.node?.progress)
        const node = content?.node;
        console.log(registration)
        if (node)
          if (node.__typename === "ExternalActivity") {
            return (
              <CourseItem
                key={JSON.stringify(node)}
                title={`${node.externalActivityInstructions}`}
                subtitle={`${node.type}`}
                type={`${node.type}`}
                clickFunction={() => {}}
                progress={progressions[content?.node?.order]?.node?.progress}
              />
            );
          } else if ("name" in node) {
            return (
              <CourseItem
              key={JSON.stringify(node)}
              title={`${node.name}`}
              subtitle={`${node.type}`}
              type={`${node.type}`}
              clickFunction={
                () =>
                navigation.navigate("Content Viewer", {
                  registrationID,
                  contentID: node.id,
                })
              }   
              progress={progressions[content?.node?.order]?.node?.progress}     
            />
            );
          }
      })}
    </View>
  );
};
