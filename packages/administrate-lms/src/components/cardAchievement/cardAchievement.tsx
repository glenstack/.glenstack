import React from "react";
import { Text, View } from "../base";

type CardProps = {
  title: string,
  expires: string,
  issuedFrom: string,
  status: string
  clickFunction: func
}

export const CardAchievement = ({ title, expires, issuedFrom, status, clickFunction }: CardProps) => {

    //TODO: proper enum options for status

  return (
    <View className="bg-gray-100 m-4 rounded-sm shadow-lg" onStartShouldSetResponder={() => clickFunction()}>
      <View className="mr-6 mt-4 ml-8">
        <Text className="font-bold text-lg">{title}</Text>
      </View>

      <View className="flex flex-row">
        <View className="mr-6 mt-4 ml-8">
            <Text className="text-sm">Expires: {expires}</Text>
        </View>   
        <View className="mr-6 mt-4 ml-8">
            <View className="bg-green-700 rounded -mt-1">
                <Text className="text-sm text-white m-1">{status.toUpperCase()}</Text>
            </View>
        </View>
      </View>

      <View className="mr-6 mt-4 ml-8">
        <Text className="text-sm">Issued from: {issuedFrom}</Text>
      </View>
    </View>
  );
};
