import React from "react";
import { Text, View, TextInput } from "../base";
import { gql, useQuery } from "@apollo/client";
import { ProfileQuery } from "./__generated__/ProfileQuery";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { TabsWithDescription } from "../tabsWithDescription/tabsWithDescription"
import { CardSettings } from "../cardSettings/cardSettings"

const PROFILE_QUERY = gql`
  query getUser {
    viewer {
      id
      lastName
      firstName
      emailAddress
      jobRole
      locale
      timeZoneName
      __typename
    }
  }
`;

type ProfileRouteProp = RouteProp<{}, "Profile">;

export const Profile = () => {
  const tabTitles = ["Profile"];

  const { loading, error, data } = useQuery<any>(PROFILE_QUERY, {
    variables: { limit: 6, $lastCursor: null },
    errorPolicy: "ignore",
  });

  return (
    <View>
      {console.log(data?.viewer)}
      <TabsWithDescription title="Profile" subtitle="" tabTitles={tabTitles} selectedTitle={0}></TabsWithDescription>
      <View className="m-6">
        <CardSettings title="Personal Details" subtitle="First Name" content={[["First Name", data?.viewer?.firstName], ["Last Name", data?.viewer?.lastName], ["Email", data?.viewer?.emailAddress], ["Job Title", data?.viewer?.jobRole]]}/>
      </View>
      <View className="m-6">
        <CardSettings title="Login Details" subtitle="Username" content={[["Locale", data?.viewer?.locale]]}/>
      </View>
    </View>
  );
};
