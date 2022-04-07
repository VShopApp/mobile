import React from "react";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import NightMarketItem from "../components/NightMarketItem";
import { getNightMarket } from "../utils/ValorantAPI";

export default function NightShop() {
  const [items, setItems] = useState<singleNightMarketItem[]>([]);
  const [noNightMarket, setNoNightMarket] = useState(false);

  useEffect(() => {
    getNightMarket().then((res) => {
      if (res.length > 0) {
        setItems(res);
      } else {
        setNoNightMarket(true);
      }
    });
  }, []);

  if (items?.length == 0 && !noNightMarket) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator animating={true} color={"#fa4454"} size="large" />
      </View>
    );
  }

  if (noNightMarket) {
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
        {items?.map((item) => (
          <NightMarketItem item={item} key={item.uuid} />
        ))}
      </ScrollView>
    </>
  );
}
