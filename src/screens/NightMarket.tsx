import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import NightMarketItem from "../components/NightMarketItem";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import Countdown from "../components/Countdown";
import { useUserStore } from "../stores/user";

export default function NightMarketScreen() {
  const { t } = useTranslation();
  const user = useUserStore(({ user }) => user);
  const timestamp =
    new Date().getTime() + user.shops.remainingSecs.nightMarket * 1000;

  return (
    <>
      {user.shops.nightMarket.length > 0 ? (
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignContent: "center",
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}>
            <Countdown timestamp={timestamp} />
          </View>
          {user.shops.nightMarket.map((item) => (
            <NightMarketItem item={item} key={item.uuid} />
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
          }}>
          <Icon
            style={{ textAlign: "center" }}
            name="weather-night"
            size={80}
            color="#fff"
          />
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              marginTop: 10,
              fontWeight: "bold",
            }}>
            {t("no_nightmarket")}
          </Text>
        </View>
      )}
    </>
  );
}
