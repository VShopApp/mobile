import React, { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { getNightShop } from "../../utils/ValorantAPI";
import NightShopItem from "../NightShopItem";

interface props {
  user: user;
}
export default function NightShop(props: PropsWithChildren<props>) {
  const [items, setItems] = useState<singleNightShopItem[]>();

  useEffect(() => {
    getNightShop(props.user).then((items) => {
      setItems(items);
    });
  }, []);

  return (
    <>
      <ScrollView>
        {items?.map((item) => (
          <NightShopItem item={item} key={item.uuid} />
        ))}
      </ScrollView>
    </>
  );
}
