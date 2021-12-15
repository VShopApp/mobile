import React, { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { ImageBackground, ScrollView, View } from "react-native";
import { Card, Paragraph, Text, Title } from "react-native-paper";
import { getBundle, getShop } from "../../utils/ValorantAPI";
import ShopItem from "../ShopItem";
import VPIcon from "../VPIcon";

interface props {
  user: user;
}
export default function Shop(props: PropsWithChildren<props>) {
  const [items, setItems] = useState<singleItem[]>();
  const [bundle, setBundle] = useState<Bundle>();

  useEffect(() => {
    getShop(props.user).then((items) => {
      setItems(items);
    });
    getBundle(props.user).then((bundle) => {
      setBundle(bundle);
    });
  }, []);

  return (
    <>
      <ScrollView>
        <ImageBackground
          style={{
            marginBottom: 5,
            flex: 1,
            justifyContent: "center",
          }}
          source={{ uri: bundle?.displayIcon }}
          resizeMode="cover"
        >
          <View
            style={{
              backgroundColor: "#000000a0",

              padding: 50,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 30,
              }}
            >
              {bundle?.displayName} Bundle
            </Text>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 15,
              }}
            >
              {bundle?.price} <VPIcon color="white" />
            </Text>
          </View>
        </ImageBackground>
        {items?.map((item: singleItem) => (
          <ShopItem item={item} key={item.uuid} />
        ))}
      </ScrollView>
    </>
  );
}
