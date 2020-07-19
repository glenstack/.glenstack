import React, { useState } from "react";
import { Text, View, TextInput } from "../base";
import { Button } from "react-native";
import { useLoginDispatch } from "../../providers/TokenProvider";
import { useDomain } from "../../providers/DomainProvider";
import { useNavigation } from "@react-navigation/native";

export const UsernamePassword = () => {
  const navigation = useNavigation();
  const domain = useDomain();
  const loginDispatch = useLoginDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    loginDispatch({ domain, username, password });
  };

  return (
    <View className="bg-blue-600 min-h-full">
      <View className="mt-24">
        <svg version="1.1">
          <g id="Layer_1">
            <g>
              <path fill="#FFFFFF" d="M40,65.6l-2.1,8.8H27.8l12.4-41H52l12.4,41H54l-2.1-8.8H40z M45.9,40.5l-4.3,18.1h8.6L45.9,40.5z"/>
              <path fill="#FFFFFF" d="M96,74.5h-8.3l-0.5-3.7c-1.8,2.6-4.7,4.7-8.9,4.7c-8,0-12-6.6-12-16.8c0-9.7,4.9-16.6,13-16.6    c2.9,0,5.4,1.1,7.3,3V29.5l9.4,1V74.5z M86.7,65V51.5c-1.4-1.7-2.8-2.7-4.9-2.7c-3.4,0-5.7,2.8-5.7,9.9c0,7.8,2.1,9.9,5.2,9.9    C83.5,68.6,85.2,67.4,86.7,65z"/>
              <path fill="#FFFFFF" d="M146,51.5v23h-9.4V53.1c0-3.3-1.2-4.2-2.7-4.2c-2,0-3.4,1.5-4.8,4.1v21.5h-9.4V53.1c0-3.3-1.2-4.2-2.7-4.2    c-2,0-3.4,1.5-4.8,4.1v21.5h-9.4V43h8.2l0.7,3.7c2.4-3.1,5.3-4.7,9.1-4.7c3.5,0,6.2,1.8,7.4,5c2.5-3.3,5.4-5,9.4-5    C142.7,42,146,45.5,146,51.5z"/>
              <path fill="#FFFFFF" d="M162.5,31.8c0,2.6-2,4.6-4.8,4.6c-2.8,0-4.7-2-4.7-4.6c0-2.6,1.9-4.6,4.7-4.6    C160.5,27.2,162.5,29.2,162.5,31.8z M212.8,31.8c0,2.6-2,4.6-4.8,4.6c-2.8,0-4.7-2-4.7-4.6c0-2.6,1.9-4.6,4.7-4.6    C210.8,27.2,212.8,29.2,212.8,31.8z M153.1,74.5V43h9.4v31.4H153.1z"/>
              <path fill="#FFFFFF" d="M196.9,51.5v23h-9.4V53.1c0-3.3-1.1-4.2-3-4.2c-2.1,0-3.8,1.5-5.4,4.1v21.5h-9.4V43h8.2l0.7,3.7    c2.7-3.1,5.7-4.7,9.6-4.7C193.6,42,196.9,45.5,196.9,51.5z"/>
              <path fill="#FFFFFF" d="M203.3,74.5V43h9.4v31.4H203.3z"/>
              <path fill="#FFFFFF" d="M243.4,45.9l-3.4,5.3c-2.4-1.6-5-2.5-7.5-2.5c-2.8,0-4.1,0.9-4.1,2.4c0,1.7,0.8,2.4,6.5,4    c6.2,1.8,9.7,4.4,9.7,10c0,6.5-6.2,10.4-14,10.4c-5.4,0-10.1-1.9-13.1-4.7l4.6-5.1c2.3,1.9,5.2,3.1,8.2,3.1c2.9,0,4.6-1.1,4.6-2.9    c0-2.2-0.9-2.8-6.6-4.4c-6.2-1.8-9.3-5-9.3-9.8c0-5.4,4.9-9.6,12.8-9.6C236.4,42,240.5,43.5,243.4,45.9z"/>
              <path fill="#FFFFFF" d="M261.1,75.5c-6.9-0.1-10.3-4-10.3-11.4V49.5h-4.4V43h4.4V32.5l9.4-1.1V43h7.2l-1,6.5h-6.2V64    c0,3,1,4.1,3,4.1c1.1,0,2.1-0.3,3.4-1.1l3.1,6C267.3,74.6,263.9,75.5,261.1,75.5z"/>
              <path fill="#FFFFFF" d="M292.9,42.6l-1.5,9.1c-1-0.2-1.8-0.4-2.8-0.4c-3.9,0-5.5,2.9-6.5,7.7v15.6h-9.4V43h8.2l0.8,6.1    c1.4-4.4,4.5-7,8.1-7C291,42.1,291.9,42.3,292.9,42.6z"/>
              <path fill="#FFFFFF" d="M323.3,69.2l-2,6.1c-3.7-0.3-6.2-1.4-7.6-4.6c-2.2,3.5-5.7,4.7-9.5,4.7c-6.3,0-10.2-4.1-10.2-9.8    c0-6.9,5.2-10.6,14.7-10.6h3.2v-1.4c0-3.7-1.5-4.9-5.3-4.9c-2,0-5.1,0.6-8.2,1.7l-2.1-6.2c4-1.5,8.3-2.3,11.8-2.3    c9.1,0,13,3.8,13,11.1v12.2C321.1,67.8,321.8,68.7,323.3,69.2z M311.9,65.8v-5.6h-2.3c-4.3,0-6.3,1.5-6.3,4.6c0,2.5,1.4,4,3.7,4    C309.2,68.8,310.8,67.7,311.9,65.8z"/>
              <path fill="#FFFFFF" d="M339.4,75.5c-6.9-0.1-10.3-4-10.3-11.4V49.5h-4.4V43h4.4V32.5l9.4-1.1V43h7.2l-1,6.5h-6.2V64    c0,3,1,4.1,3,4.1c1.1,0,2.1-0.3,3.4-1.1l3.1,6C345.5,74.6,342.2,75.5,339.4,75.5z"/>
              <path fill="#FFFFFF" d="M377.6,61.5h-19.5c0.7,5.6,3.3,7.2,7.2,7.2c2.5,0,4.8-0.9,7.5-2.8l3.8,5.2c-3.1,2.5-7.2,4.4-12.3,4.4    c-10.5,0-15.8-6.7-15.8-16.6c0-9.4,5.1-16.9,14.7-16.9c9,0,14.5,5.9,14.5,16.1C377.8,59.1,377.8,60.6,377.6,61.5z M368.7,55.5    c-0.1-4.3-1.4-7.2-5.1-7.2c-3.1,0-5,2-5.4,7.6h10.5V55.5z"/>
            </g>
          </g>
          <g id="Isolation_Mode">
          </g>
        </svg>
      </View>
      <View className="bg-gray-100 m-4 rounded-lg shadow-lg">
        <View className="border-b border-gray-500 m-6">
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={(value) => setUsername(value)}
            autoFocus={true}
            autoCompleteType="email"
            textContentType="emailAddress"
            accessibilityLabel="Username"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
        </View>
        <View className="border-b border-gray-500 m-6">
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(value) => setPassword(value)}
            autoCompleteType="password"
            textContentType="password"
            accessibilityLabel="Password"
            secureTextEntry={true}
            autoCapitalize="none"
            onSubmitEditing={login}
          />
        </View>
        <Text className="m-4">
          Log in with Google
        </Text>
        <View className="m-4">
          <Button title="Login" disabled={loading} onPress={login} />
          <Button
            title="Forgot Password"
            onPress={() => {
              navigation.navigate("Forgot Password", { username });
            }}
          />
        </View>
      </View>
    </View>
  );
};
