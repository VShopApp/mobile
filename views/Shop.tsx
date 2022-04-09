import React from "react";
import { ScrollView } from "react-native";
import Bundle from "../components/Bundle";
import ShopItem from "../components/ShopItem";
import { sShop } from "../utils/ValorantAPI";

export default function Shop() {
  return (
    <>
      <ScrollView>
        <Bundle />
        {sShop?.map((item) => (
          <ShopItem item={item} key={item.uuid} />
        ))}
      </ScrollView>
    </>
  );
}
