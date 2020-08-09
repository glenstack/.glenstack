import React from "react";
import { View } from "../base";
import { gql, useQuery } from "@apollo/client";
import { ProfileQuery } from "./__generated__/ProfileQuery";
import { RouteProp } from "@react-navigation/native";
import { Header } from "../header/header"
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
  const tabTitles = [""];

  const { loading, error, data } = useQuery<any>(PROFILE_QUERY, {
    errorPolicy: "ignore",
  });

  return (
    <View>
      {console.log(data?.viewer)}
      <Header title="Profile"></Header>
      <View className="m-6">
        <CardSettings title="Personal Details" subtitle="First Name" content={[["First Name", data?.viewer?.firstName], ["Last Name", data?.viewer?.lastName], ["Email", data?.viewer?.emailAddress], ["Job Title", data?.viewer?.jobRole]]}/>
      </View>
      <View className="m-6">
        <CardSettings title="Login Details" subtitle="" content={[["Username", data?.viewer?.emailAddress], ["New Password", " "], ["Confirm Password", " "], ["Old password", " "]]}/>
      </View>
    </View>
  );
};
