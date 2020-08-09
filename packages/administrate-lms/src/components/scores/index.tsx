import React from "react";
import { View } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { Logout } from "../login/logout";
import { TabsWithDescription } from "../tabsWithDescription/tabsWithDescription"
import { useNavigation } from "@react-navigation/native";

const SCORES_QUERY = gql`
query getAchievements($achievementOrder: AchievementFieldOrder) {
  achievements(order: $achievementOrder) {
    edges {
      node {
        id
        achievementType {
          id
          name
          __typename
        }
        achievedAt
        expiresAt
        lifecycleState
        identifier
        registerable {
          id
          title
          __typename
        }
        certificateUrl
        documentUrls
        documentIds
        __typename
      }
      __typename
    }
    __typename
  }
}

  `
;

const tabTitles = ["Overview", "Scores"];

export const Scores = () => {

  const navigation = useNavigation();
  
  const { loading, error, data } = useQuery<any>(SCORES_QUERY, {
    variables: { },
    errorPolicy: "ignore",
  });

  var cards = []
  
  if(data){
    console.log(data)
  }

  // TODO: Loading & error states

  return (
    <View>
      <Logout />
      <TabsWithDescription title="Administrate LMS" subtitle="Location: Concordia University" tabTitles={tabTitles} selectedTab="Scores"></TabsWithDescription>
    </View>
  );
};
