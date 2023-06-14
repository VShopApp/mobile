import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import { CombinedDarkTheme } from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  const { i18n } = useTranslation();
  const navigation = useNavigation<any>();

  React.useEffect(() => {
    (async () => {
      if (i18n.isInitialized) {
        // If user has set the region, he *should* be a returning user
        const region = await AsyncStorage.getItem("region");

        if (region) {
          navigation.replace("reauth");
        } else {
          navigation.replace("wizard");
        }
      }
    })();
  }, [i18n.isInitialized]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: CombinedDarkTheme.colors.primary,
      }}>
      <Image
        style={{
          width: 100,
          height: 100,
        }}
        source={require("../../assets/logo-t-100.png")}
      />
    </View>
  );
}
