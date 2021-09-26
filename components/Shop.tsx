import React, { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { getShop } from "../utils/ValorantAPI";
import ShopItem from "./ShopItem";

interface props {
  user: user;
  visible: boolean;
}
export default function Shop(props: PropsWithChildren<props>) {
  const [items, setItems] = useState<shopItems>();

  useEffect(() => {
    getShop(props.user).then((items) => {
      setItems(items);
    });
  }, []);

  if (!props.visible) return <></>;

  return (
    <>
      <ScrollView>
        {items?.singleItems.map((item: singleItem) => (
          <ShopItem item={item} key={item.uuid} />
        ))}
      </ScrollView>
    </>
  );
}
