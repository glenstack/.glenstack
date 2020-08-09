import React from "react";
import { Text, View } from "../base";
import { ProgressBar } from "../progressBar/progressBar";

type CardProps = {
  title: string,
  subtitle: string,
  numberOfStepsCompleted: string,
  numberOfSteps: string
  clickFunction: func
}

export const CardProgress = ({ title, subtitle, numberOfStepsCompleted, numberOfSteps, clickFunction }: CardProps) => {
  return (
    <View className="bg-gray-100 m-4 rounded-sm shadow-lg" onStartShouldSetResponder={() => clickFunction()}>
      <View className="mr-6 mt-4 ml-8">
        <Text className="font-bold text-lg">{title}</Text>
      </View>
      <View className="mr-6 mt-4 ml-8">
        <Text className="text-sm">{subtitle}</Text>
      </View>
      <View className="m-6">
        <ProgressBar numberOfStepsCompleted={numberOfStepsCompleted} numberOfSteps={numberOfSteps}></ProgressBar>
      </View>
    </View>
  );
};
