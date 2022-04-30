import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import NightMarketItem from "../components/NightMarketItem";
import { sNightMarket } from "../utils/ValorantAPI";

export default function NightShop() {
  if (sNightMarket?.length == 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          There is currently no night market.
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView>
        {sNightMarket?.map((item) => (
          <NightMarketItem item={item} key={item.uuid} />
        ))}
      </ScrollView>
    </>
  );
}
