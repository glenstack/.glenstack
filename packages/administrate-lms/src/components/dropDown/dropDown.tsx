import React, { useState } from "react";
import { Text, View } from "../base";
import { Button } from "react-native";
import { func } from "@hapi/joi";

type dropDownProps = {
  title: string
}

export const DropDown = ({ title }: dropDownProps) => {

  const [dropDownState, setDropDownState] = useState({tabIndex:0, hidden: true});

  var items = []
  const tabTitles = ["one", "two", "three"]
  
  if(dropDownState.hidden){
    for (const [index, value] of tabTitles.entries()) {
        console.log(index)
        if(dropDownState.tabIndex == index){
            items.push(
                <View className=""><View className="rounded-t bg-gray-200 py-2 px-4 block whitespace-no-wrap" onClick={() => setDropDownState({tabIndex: index, hidden:true})}>{value}</View></View>
            )
          }else{
            items.push(
                <View className=""><View className="rounded-t bg-gray-400 py-2 px-4 block whitespace-no-wrap" onClick={() => setDropDownState({tabIndex: index, hidden:!dropDownState.hidden})}>{value}</View></View>
            )
          }
    }
    }else{
        console.log("not hidden")
        items.push(
            <View className="rounded-t bg-gray-200 py-2 px-4 block whitespace-no-wrap" onClick={() => setDropDownState({tabIndex: dropDownState.tabIndex, hidden:true})}>{tabTitles[dropDownState.tabIndex]}</View>
            
        )
    }

  return (
    <View className="p-10">
        <View className="dropdown inline-block relative">
        <View className="dropdown-menu absolute text-gray-700 pt-1">
            <View className="flex-row m-4 bg-gray-200">
                <View>
                    {items}
                </View>
                <View className="ml-10">
                    <svg class="fill-current h-4 w-4" width="300" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/> </svg>
                </View>
            </View>
        </View>
        </View>
    </View>
  );
};
