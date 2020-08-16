import React from "react";
import { View } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { Logout } from "../login/logout";
import { TabsWithDescription } from "../tabsWithDescription/tabsWithDescription"
import { useNavigation } from "@react-navigation/native";
import { CardAchievement } from "../cardAchievement/cardAchievement"

const ACHIEVEMENTS_QUERY = gql`
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

const tabTitles = ["Courses", "Achievements"];

export const Achievements = () => {

  const navigation = useNavigation();
  
  const { loading, error, data } = useQuery<any>(ACHIEVEMENTS_QUERY, {
    variables: { },
    errorPolicy: "ignore",
  });

  var cards = []
  
  if(data){
    console.log(data)
  }

  // TODO: Loading & error states

  const achievements = data?.achievements?.edges || []

  //TODO: Certificate URL

  return (
    <View>
      <Logout />
      <TabsWithDescription title="Administrate LMS" subtitle="Location: Concordia University" tabTitles={tabTitles} selectedTab="Achievements"></TabsWithDescription>
      {achievements.map((achievement) => {
        return(
          <CardAchievement
            title={achievement?.node?.achievementType.name}
            expires={achievement?.node?.expiresAt}
            issuedFrom={achievement?.node?.registerable?.title}
            status={achievement?.node?.lifecycleState}
          >
          </CardAchievement>
        )
        }
      )}
    </View>
  );
};
