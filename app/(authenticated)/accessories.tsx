import React from "react";
import { ScrollView, View } from "react-native";
import Countdown from "~/components/Countdown";
import { useUserStore } from "~/hooks/useUserStore";
import ShopAccessoryItem from "~/components/ShopAccessoryItem";

function AccessoryShop() {
  const user = useUserStore((state) => state.user);
  const timestamp = new Date().getTime() + user.shops.remainingSecs.accessory * 1000;

  return (
    <>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignContent: "center",
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        >
            <Countdown timestamp={timestamp} />
        </View>
        {user.shops.accessory.map((item) => (
          <ShopAccessoryItem item={item} key={item.uuid} />
        ))}
      </ScrollView>
    </>
  );
}

export default AccessoryShop;
