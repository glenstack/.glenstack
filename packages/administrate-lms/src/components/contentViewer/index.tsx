import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useToken } from "../../providers/TokenProvider";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import WebView from "react-native-webview";
import { useDomain } from "../../providers/DomainProvider";
import { gql, useQuery } from "@apollo/client";
import { ContentViewerQuery } from "./__generated__/ContentViewerQuery";
import { DISTRIBUTION_HOST, USER_AGENT } from "../../config";

const CONTENT_VIEWER_QUERY = gql`
  query ContentViewerQuery {
    viewer {
      username
    }
  }
`;

export type ContentViewerParams = {
  "Content Viewer": {
    registrationID: string;
    contentID: string;
  };
};

type ContentViewerRouteProp = RouteProp<ContentViewerParams, "Content Viewer">;

export const ContentViewer = () => {
  const navigation = useNavigation();
  const domain = useDomain();
  const token = useToken();
  const [newToken, setNewToken] = useState<{
    token?: string;
    username?: string | null;
  }>({});
  const { registrationID, contentID } = useRoute<
    ContentViewerRouteProp
  >().params;
  const { loading, error, data } = useQuery<ContentViewerQuery>(
    CONTENT_VIEWER_QUERY
  );

  const username = data?.viewer?.username;
  const uri = `https://${domain}/registration/${registrationID}/content/${contentID}`;

  useEffect(() => {
    token.then(({ token }) => {
      setNewToken({ token, username });
    });
  }, [token, username]);

  // TODO: Error states

  if (loading) return <Text>Loading...</Text>;

  const injectedJavaScript = `(() => {
    const token = ${JSON.stringify(newToken.token)};
    const username = ${JSON.stringify(newToken.username)};
    const uri = ${JSON.stringify(uri)};
    localStorage.setItem('lms-portal-token', JSON.stringify({ token, username }));

    if (window.location.href !== uri) { window.location.replace(uri); }
    
    if (document.getElementById('injectedScript')) { return; }
    const injectedScript = document.createElement('script');
    injectedScript.id = 'injectedScript';
    injectedScript.src = '//${DISTRIBUTION_HOST}/injectedScripts/contentViewer.js';
    document.getElementsByTagName('head')[0].appendChild(injectedScript);
  })()`;

  return (
    <WebView
      userAgent={USER_AGENT}
      source={{
        // uri: `https://${domain}/404`,
        uri,
      }}
      onMessage={({ nativeEvent }) => {
        if (nativeEvent.url !== uri) {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate("Course List");
          }
        }
      }} // https://github.com/react-native-community/react-native-webview/issues/1291#issuecomment-609103010
      injectedJavaScript={injectedJavaScript}
    />
  );
};
