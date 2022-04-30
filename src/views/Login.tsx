import { PropsWithChildren, useState } from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Checkbox,
  IconButton,
  Text,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { getAccessTokenFromUri } from "../utils/misc";
import { setup } from "../utils/ValorantAPI";

const LOGIN_URL =
  "https://auth.riotgames.com/login#client_id=play-valorant-web-prod&nonce=1&redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&response_type=token%20id_token";

interface props {
  setLoggedIn: Function;
}
export default function Login(props: PropsWithChildren<props>) {
  let username = "Unknown";
  const [region, setRegion] = useState("eu");
  const [savePw, setSavePw] = useState(true);
  const [dropdownShown, setDropdownShown] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isWebViewOpen, setIsWebViewOpen] = useState(false);

  const handleWebViewChange = async (newNavState: {
    url?: string;
    title?: string;
    loading?: boolean;
    canGoBack?: boolean;
    canGoForward?: boolean;
  }) => {
    if (!newNavState.url) return;

    if (newNavState.url.startsWith("https://playvalorant.com/opt_in")) {
      setLoading(true);
      const accessToken = getAccessTokenFromUri(newNavState.url);
      await setup(accessToken, username, region);
      props.setLoggedIn(true);
    }
  };

  const onMessage = (event: WebViewMessageEvent) => {
    username = event.nativeEvent.data;
  };

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
        }}
      >
        <ActivityIndicator animating={true} color={"#fa4454"} size="large" />
      </View>
    );

  return (
    <>
      {isWebViewOpen && (
        <View
          style={{
            position: "absolute",
            top: 45,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            paddingVertical: 10,
          }}
        >
          <IconButton
            icon="close"
            color={"#ffffff"}
            size={20}
            onPress={() => setIsWebViewOpen(false)}
            style={{
              backgroundColor: "#fa4454",
              padding: 5,
              position: "absolute",
              top: 15,
              zIndex: 200,
            }}
          />
          <WebView
            userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"
            source={{
              uri: LOGIN_URL,
            }}
            onNavigationStateChange={handleWebViewChange}
            injectedJavaScript={`
              document.getElementsByClassName("mobile-button__submit")[0].addEventListener("click", () => window.ReactNativeWebView.postMessage(document.getElementsByName("username")[0].value));
              `}
            onMessage={onMessage}
          />
        </View>
      )}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
        }}
      >
        <>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>Welcome</Text>
          <Text style={{ fontSize: 14, marginBottom: 18 }}>
            Please log in to continue
          </Text>
          <View style={{ width: 250, marginBottom: 4 }}>
            <DropDown
              label={"Region"}
              mode={"outlined"}
              visible={dropdownShown}
              showDropDown={() => setDropdownShown(true)}
              onDismiss={() => setDropdownShown(false)}
              value={region}
              setValue={setRegion}
              list={[
                { label: "Europe", value: "eu" },
                { label: "North America", value: "na" },
                { label: "Asia-Pacific", value: "ap" },
                { label: "Korea", value: "kr" },
              ]}
            />
          </View>
          <Checkbox.Item
            label="Save credentials"
            status={savePw ? "checked" : "unchecked"}
            onPress={() => {
              setSavePw(!savePw);
            }}
          />
          <Button
            onPress={() => setIsWebViewOpen(true)}
            mode="contained"
            style={{ marginTop: 4 }}
          >
            Log In
          </Button>
        </>
      </View>
    </>
  );
}
