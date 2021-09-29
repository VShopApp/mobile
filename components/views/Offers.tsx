import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { offers } from "../../utils/ValorantAPI";

interface props {}
export default function Offers(props: PropsWithChildren<props>) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{JSON.stringify(offers)}</Text>
    </View>
  );
}
