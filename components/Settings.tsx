import React, { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { clearCookies } from "../utils/ValorantAPI";

interface props {
  user: user;
  setUser: Function;
  visible: boolean;
}
export default function Settings(props: PropsWithChildren<props>) {
  const handleLogout = () => {
    clearCookies();
    props.setUser(null);
  };

  if (!props.visible) return <></>;

  return (
    <View style={styles.container}>
      <Text>Logged in as {props.user.name}</Text>
      <Button onPress={handleLogout} mode="contained">
        Log Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
