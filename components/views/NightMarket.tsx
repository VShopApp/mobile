import React, { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { getNightMarket } from "../../utils/ValorantAPI";
import NightMarketItem from "../NightMarketItem";

interface props {
  user: user;
}
export default function NightShop(props: PropsWithChildren<props>) {
  const [items, setItems] = useState<singleNightMarketItem[]>();
  const [noNightMarket, setNoNightMarket] = useState(false);

  useEffect(() => {
    getNightMarket(props.user).then((items) => {
      if (items.length > 0) {
        setItems(items);
      } else {
        setNoNightMarket(true);
      }
    });
  }, []);

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
