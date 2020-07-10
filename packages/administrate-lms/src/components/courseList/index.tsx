import React from "react";
import { View, Text, Button } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { Logout } from "../login/logout";
import { TabsWithDescription } from "../tabsWithDescription/tabsWithDescription"
import { CardProgress } from "../cardProgress/cardProgress"
import { useNavigation } from "@react-navigation/native";

const COURSE_LIST_QUERY = gql`
    query allActiveRegisterables($limit: Int!, $lastCursor: String) {
      registerables(first: $limit, filters: [{field: hasParent, operation: eq, value: "false"}, {field: isActive, operation: eq, value: "true"}], after: $lastCursor, order: {field: title, direction: asc}) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            ... on Registration {
              id
              expiry
              totalPiecesOfContent
              completedPiecesOfContent
              course {
                id
                title
                learningMode
                imageUrl
                categories {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
            ... on LearningPathRegistration {
              id
              progressMade
              expectedProgress
              startDate
              learningPath {
                id
                name
                longDescription
                imageUrl
              }
            }
          }
        }
      }
    }
  `
;

const tabTitles = ["Courses", "Resources"];

export const CourseList = () => {

  const navigation = useNavigation();
  
  const { loading, error, data } = useQuery<any>(COURSE_LIST_QUERY, {
    variables: { limit: 6, $lastCursor: null },
    errorPolicy: "ignore",
  });

  var cards = []
  
  if(data){
    for(var value in data?.registerables?.edges){
      cards.push(
        <CardProgress
          title={data?.registerables?.edges[value]?.node?.course?.title} 
          subtitle="" numberOfStepsCompleted={data?.registerables?.edges[value]?.node.completedPiecesOfContent}
          numberOfSteps={data?.registerables?.edges[value]?.node.totalPiecesOfContent}
          key={JSON.stringify(data?.registerables?.edges[value])}
          clickFunction={
            () => navigation.navigate("Registration", {
              registrationID: data?.registerables?.edges[value]?.node?.id,
            })
          }
        ></CardProgress>
      )
    }
  }

  // TODO: Loading & error states

  return (
    <View>
      <Logout />
      <TabsWithDescription title="Administrate LMS" subtitle="Location: Concordia University" tabTitles={tabTitles} selectedTitle={0}></TabsWithDescription>
      <View>{cards}</View>
    </View>
  );
};
