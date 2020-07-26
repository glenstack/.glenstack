import React from "react";
import { Text, View } from "../base";
import { DropDown } from "../dropDown/dropDown"


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
  content: any[]
}

export const CardSettings = ({ title, subtitle, content }: CardProps) => {
  var theBody = []

  if(content){
    console.log(content)
    content.forEach(function(value){
      console.log(content)
      if(value && value[1]){
        theBody.push(
          <View className="m-4">
            <Text className="font-bold text-gray-600">
              {value[0]}
            </Text>
            <Text className="text-gray-600 border-b border-gray-600">
              {value[1]}
            </Text>
          </View>
        )
      }
    })
  }

  return (
    <View className="m-4">
      <View className="bg-gray-900 rounded-t shadow-lg">
        <View className="">
          <Text className="text-md text-white m-2">{title}</Text>
        </View>
      </View>
      <View className="bg-gray-100 rounded-b shadow-lg">
        {theBody}
        <DropDown title="Hi" hidden={true}></DropDown>
      </View>
    </View>
  );
};
