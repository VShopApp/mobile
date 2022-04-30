import React, { PropsWithChildren } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, Divider } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { sRegion, reset, sUsername } from "../utils/ValorantAPI";
import { List } from "react-native-paper";
import { regions } from "../utils/misc";
import * as WebBrowser from "expo-web-browser";

interface props {
  setLoggedIn: Function;
}
export default function Settings(props: PropsWithChildren<props>) {
  const handleLogout = () => {
    SecureStore.deleteItemAsync("user").then(() => {
      reset();
      props.setLoggedIn(false);
    });
  };

  return (
    <>
      <List.Item
        title="Logged in as"
        description={sUsername}
        left={(props) => <List.Icon {...props} icon="account" />}
        right={(props) => (
          <TouchableOpacity onPress={handleLogout}>
            <List.Icon {...props} icon="logout" color="#fa4454" />
          </TouchableOpacity>
        )}
      />
      <Divider />
      <List.Item
        title="Region"
        description={regions[sRegion]}
        left={(props) => <List.Icon {...props} icon="earth" />}
      />
      <Divider />
      <List.Item
        title="Version"
        description={`${Constants.manifest?.version} - ${Updates.releaseChannel}`}
        left={(props) => <List.Icon {...props} icon="cellphone-information" />}
      />
      <Divider />
      <Button
        icon="reload"
        mode="contained"
        onPress={() => {
          Updates.reloadAsync();
        }}
        style={{ marginHorizontal: 10, marginVertical: 10 }}
      >
        Refresh
      </Button>
      <Divider />
      <View>
        <Button
          icon="information"
          mode="contained"
          onPress={() =>
            WebBrowser.openBrowserAsync("https://vshop.one/privacy")
          }
          style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}
        >
          Privacy Policy
        </Button>
        <Button
          icon="discord"
          mode="contained"
          onPress={() =>
            WebBrowser.openBrowserAsync("https://vshop.one/discord")
          }
          style={{ marginHorizontal: 10, marginVertical: 5 }}
        >
          Discord Server
        </Button>
      </View>
    </>
  );
}
