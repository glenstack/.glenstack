import React from "react";
import { Text, View } from "../base";

type CardProps = {
  title: string,
  subtitle: string,
  clickFunction: func
  type: string
}

function ResourceType(props) {
    const type = props.type;
    console.log(type)
    if (type == "resource") {
        return <svg className="fill-black" width="25" height="25" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><path d="M453.7,20.4c0-11.2-9.2-20.4-20.4-20.4H114.2C70.4,0,35.7,34.7,35.7,77.5c0,0,0,349.5,0,349.7c0,34.7,28.5,62.2,63.2,62.2    h333.4c8.2,0,16.3-5.1,19.4-13.3c3.1-8.2,1-17.3-6.1-22.4c-18.1-11.5-19.2-36.7-3.1-47.9c3.4-3.4,11.1-10.4,10.5-20.4    C453.5,383.8,453.7,20.4,453.7,20.4z M76.5,427.2c0-12.2,10.2-21.4,22.4-21.4h293.7c-9,15-7.1,32.6,0,42.8H98.9    C86.7,448.6,76.5,439.5,76.5,427.2z M413,365H99c-7.9,0-15.4,1.5-22.4,4.2V77.5c0-20.4,17.3-36.7,37.7-36.7h298.8V365H413z"/></svg>
    }
    if(type == "scorm"){
        return <svg className="fill-black" width="25" height="25" viewBox="0 0 263 263" xmlns="http://www.w3.org/2000/svg"><path d="M257.333,25.497h-32.867c0.124-0.48,0.196-0.98,0.196-1.499c0-3.313-2.687-6-6-6h-46.51   c0.012-0.161,0.025-0.321,0.025-0.485c0-3.581-2.904-6.485-6.485-6.485h-68.05c-3.581,0-6.485,2.903-6.485,6.485   c0,0.164,0.013,0.324,0.025,0.485h-46.51c-3.313,0-6,2.687-6,6c0,0.518,0.073,1.019,0.196,1.499H6c-3.314,0-6,2.686-6,6v148.492   c0,3.313,2.686,6,6,6h115.926l-34.101,57.244c-1.696,2.847-0.763,6.53,2.084,8.226c2.848,1.696,6.53,0.763,8.226-2.084   l27.532-46.217v33.019c0,3.313,2.687,6,6,6s6-2.687,6-6v-33.019l27.532,46.217c1.123,1.884,3.116,2.93,5.161,2.93   c1.044,0,2.103-0.273,3.065-0.846c2.847-1.696,3.78-5.378,2.084-8.226l-34.101-57.244h115.926c3.314,0,6-2.687,6-6V31.497   C263.333,28.183,260.647,25.497,257.333,25.497z M251.333,173.989H12V37.497h239.333V173.989z"/></svg>
    }
    if (type == "video") {
        return <svg className="fill-black" width="25" height="25" viewBox="0 0 125 125" xmlns="http://www.w3.org/2000/svg"><path d="M113.956,57.006l-97.4-56.2c-4-2.3-9,0.6-9,5.2v112.5c0,4.6,5,7.5,9,5.2l97.4-56.2   C117.956,65.105,117.956,59.306,113.956,57.006z"/></svg>
    }
    return <Text></Text>;
  }

export const CourseItem = ({ title, subtitle, clickFunction, type }: CardProps) => {
  return (
    <View className="" onStartShouldSetResponder={() => clickFunction()}>
        <View className="border border-gray-300"></View>
        <View className="flex-row">
            <View className="mt-6 ml-4" >
                <ResourceType type={type} />
            </View>
            <View className="mt-4 ml-4 mb-4">
                <Text className="font-bold text-base">{title}</Text>
                <Text className="text-sm">{subtitle}</Text>
            </View>
        </View>
    </View>
  );
};
