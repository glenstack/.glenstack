import React, { useReducer } from "react";
import { Text, View, TextInput } from "../base";


// How do?
// https://github.com/tailwindcss/discuss/issues/73
// @responsive {
//   .bg-gradient-blue-to-purple {
//     background-image: linear-gradient(to right, config('colors.blue'), config('colors.purple'));
//   }
// }


type CardProps = {
  title: string,
  subtitle: string,
  content: string
}

export const CardSettings = ({ title, subtitle, content }: CardProps) => {
  return (
    <View className="m-4">
      <View className="bg-gray-900 rounded-t shadow-lg">
        <View className="">
          <Text className="text-md text-white m-2">{title}</Text>
        </View>
      </View>
      <View className="bg-gray-100 rounded-b shadow-lg">
        <View className="mr-6 mt-4 ml-8">
          <Text className="text-sm">{subtitle}</Text>
        </View>
        <View className="mr-6 mt-4 ml-8">
          <Text className="text-xs">{content}</Text>
        </View>
      </View>
    </View>
  );
};
