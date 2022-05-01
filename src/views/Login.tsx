import { PropsWithChildren, useEffect, useState } from "react";
import { Image, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import WebView from "react-native-webview";
import { clearRTCCookies, getAccessTokenFromUri } from "../utils/misc";
import { setup } from "../utils/ValorantAPI";
import * as SecureStore from "expo-secure-store";

const LOGIN_URL =
  "https://auth.riotgames.com/login#client_id=play-valorant-web-prod&nonce=1&redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&response_type=token%20id_token";

interface props {
  setLoggedIn: Function;
}
export default function Login(props: PropsWithChildren<props>) {
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
      await setup(accessToken, region);
      props.setLoggedIn(true);
    }
  };

  useEffect(() => {
    SecureStore.getItemAsync("region").then((region) =>
      setRegion(region || "eu")
    );
  }, []);

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
            onPress={() => {
              setIsWebViewOpen(false);
              clearRTCCookies();
            }}
            style={{
              backgroundColor: "#fa4454",
              padding: 5,
              position: "absolute",
              top: 15,
              zIndex: 200,
            }}
          />
          <WebView
            userAgent="Mozilla/5.0 (Linux; Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"
            source={{
              uri: LOGIN_URL,
            }}
            onNavigationStateChange={handleWebViewChange}
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
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              marginBottom: 5,
            }}
            source={require("../assets/logo.png")}
          />
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            Welcome to VShop
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 10 }}>
            See your Valorant shop anywhere, anytime.
          </Text>
          <View style={{ width: 225 }}>
            <DropDown
              label="Region"
              mode="outlined"
              visible={dropdownVisible}
              showDropDown={() => setDropdownVisible(true)}
              onDismiss={() => setDropdownVisible(false)}
              value={region}
              setValue={setRegion}
              list={[
                { label: "Europe", value: "eu" },
                { label: "North America", value: "na" },
                { label: "Asia-Pacific", value: "ap" },
                { label: "Korea", value: "kr" },
              ]}
            />
            <Button
              onPress={() => setIsWebViewOpen(true)}
              mode="contained"
              icon="login"
              style={{ marginTop: 5 }}
            >
              Sign In with Riot ID
            </Button>
          </View>
        </>
      </View>
    </>
  );
}
