import React from "react";
import registerRootComponent from "expo/build/launch/registerRootComponent";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { DomainProvider } from "./providers/DomainProvider";
import { TokenProvider } from "./providers/TokenProvider";
import { ClientProvider } from "./providers/ClientProvider";
import { Login } from "./components/login";
import {
  SSOWebViewModal,
  SSOWebViewModalParams,
} from "./components/login/ssoWebViewModal";
import { CourseList } from "./components/courseList";
import {
  ForgotPasswordModal,
  ForgotPasswordModalParams,
} from "./components/login/forgotPasswordModal";
import {
  ResetPasswordModal,
  ResetPasswordModalParams,
} from "./components/login/resetPasswordModal";
import { ContentViewer, ContentViewerParams } from "./components/contentViewer";
import { Registration, RegistrationParams } from "./components/registration";
import { Profile } from "./components/profile";
import { Achievements } from "./components/achievements";

type StackParamList = {
  Login: undefined;
  "Course List": undefined;
} & ForgotPasswordModalParams &
  ResetPasswordModalParams &
  SSOWebViewModalParams &
  RegistrationParams &
  ContentViewerParams;

const Stack = createStackNavigator<StackParamList>();

const App = () => {
  return (
    <DomainProvider>
      <TokenProvider>
        <ClientProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SSO" component={SSOWebViewModal} />
              <Stack.Screen
                name="Forgot Password"
                component={ForgotPasswordModal}
              />
              <Stack.Screen
                name="Reset Password"
                component={ResetPasswordModal}
              />
              <Stack.Screen name="Courses" component={CourseList} />
              <Stack.Screen name="Content Viewer" component={ContentViewer} />
              <Stack.Screen name="Overview" component={Registration} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Achievements" component={Achievements} />
            </Stack.Navigator>
          </NavigationContainer>
        </ClientProvider>
      </TokenProvider>
    </DomainProvider>
  );
};

registerRootComponent(App);

export default App;
