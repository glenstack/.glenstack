import React from "react";
import { View, Text, Button } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { Logout } from "../login/logout";
import { useNavigation } from "@react-navigation/native";
import { CourseListQuery } from "./__generated__/CourseListQuery";

const COURSE_LIST_QUERY = gql`
  query CourseListQuery {
    viewer {
      username
      firstName
      lastName
    }
    registrations {
      edges {
        node {
          id
          course {
            title
          }
        }
      }
    }
  }
`;

export const CourseList = () => {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery<CourseListQuery>(COURSE_LIST_QUERY);

  // TODO: Loading & error states
  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>{data?.viewer?.username}</Text>
      <Text>{data?.viewer?.firstName}</Text>
      <Text>{data?.viewer?.lastName}</Text>
      <Logout />
      {data?.registrations?.edges?.map((registration) => (
        <Button
          key={JSON.stringify(registration)}
          title={`${registration?.node?.course?.title}`}
          onPress={() =>
            navigation.navigate("Registration", {
              registrationID: registration?.node?.id,
            })
          }
        />
      ))}
    </View>
  );
};
