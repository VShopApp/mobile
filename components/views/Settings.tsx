import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { clearCookies } from "../../utils/ValorantAPI";
import * as SecureStore from "expo-secure-store";

interface props {
  user: user;
  setUser: Function;
}
export default function Settings(props: PropsWithChildren<props>) {
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("user");
    clearCookies();
    props.setUser(null);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 15 }}>
        Logged in as{" "}
        <Text style={{ fontWeight: "bold" }}>{props.user.name}</Text>
      </Text>
      <Button style={{ marginTop: 10 }} onPress={handleLogout} mode="contained">
        Log Out
      </Button>
    </View>
  );
}
