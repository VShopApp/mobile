import React, { PropsWithChildren, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { clearCookies } from "../../utils/ValorantAPI";
import * as Linking from "expo-linking";

interface props {
  user: user;
  setUser: Function;
}
export default function Settings(props: PropsWithChildren<props>) {
  const handleLogout = () => {
    clearCookies();
    props.setUser(null);
  };

  const handleChangelog = () => {
    Linking.openURL("https://vshop.vasc.dev/changelog");
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
      <Button
        style={{ marginTop: 10 }}
        onPress={handleChangelog}
        mode="contained"
      >
        Changelog
      </Button>
    </View>
  );
}
