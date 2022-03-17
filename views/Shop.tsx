import React from "react";
import { useEffect, useState } from "react";
import { ImageBackground, ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { getShop, sRegion } from "../utils/ValorantAPI";
import ShopItem from "../components/ShopItem";
import VPIcon from "../components/VPIcon";

export default function Shop() {
  const [items, setItems] = useState<singleItem[]>([]);
  const [bundle, setBundle] = useState<Bundle>();

  useEffect(() => {
    getShop(sRegion).then((res) => {
      setItems(res.shop);
      setBundle(res.bundle);
    });
  }, []);

  if (items?.length == 0 || !bundle) {
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
