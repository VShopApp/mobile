import React from "react";
import { Checkbox, List, Text, TouchableRipple } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Linking, ToastAndroid, ScrollView } from "react-native";
import CookieManager from "@react-native-cookies/cookies";
import { Platform } from "react-native";
import { useUserStore } from "~/hooks/useUserStore";
import { useFeatureStore } from "~/hooks/useFeatureStore";
import { useDonatePopupStore } from "~/components/popups/DonatePopup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultUser } from "~/utils/valorant-api";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import {
  checkShop,
  initBackgroundFetch,
  stopBackgroundFetch,
} from "~/utils/wishlist";
import * as Notifications from "expo-notifications";
import { useWishlistStore } from "~/hooks/useWishlistStore";
import BatteryOptimizationWarning from "~/components/BatteryOptimizationWarning";

function Settings() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const { isDonator, screenshotModeEnabled, toggleScreenshotMode } =
    useFeatureStore();
  const notificationEnabled = useWishlistStore(
    (state) => state.notificationEnabled
  );
  const setNotificationEnabled = useWishlistStore(
    (state) => state.setNotificationEnabled
  );
  const wishlistedSkins = useWishlistStore((state) => state.skinIds);
  const { showDonatePopup } = useDonatePopupStore();

  const handleLogout = async () => {
    await CookieManager.clearAll(true);
    await AsyncStorage.removeItem("region");
    setUser(defaultUser);
    stopBackgroundFetch();
    setNotificationEnabled(false);
    router.replace("/setup");
  };

  const toggleNotificationEnabled = async () => {
    if (isDonator) {
      if (!notificationEnabled) {
        const permission = await Notifications.requestPermissionsAsync();
        if (permission.granted) {
          await initBackgroundFetch();
          setNotificationEnabled(true);
          ToastAndroid.show(
            t("wishlist.notification.enabled"),
            ToastAndroid.LONG
          );
        } else {
          ToastAndroid.show(
            t("wishlist.notification.no_permission"),
            ToastAndroid.LONG
          );
        }
      } else {
        await stopBackgroundFetch();
        setNotificationEnabled(false);
        ToastAndroid.show(
          t("wishlist.notification.disabled"),
          ToastAndroid.LONG
        );
      }
    } else {
      showDonatePopup();
    }
  };

  const showLastExecution = async () => {
    const lastWishlistCheck = await AsyncStorage.getItem("lastWishlistCheck");
    const ms = Number.parseInt(lastWishlistCheck || "0");
    if (ms > 0) {
      const hours = Math.floor((new Date().getTime() - ms) / 1000 / 60 / 60);
      const minutes = Math.floor((new Date().getTime() - ms) / 1000 / 60);
      ToastAndroid.show(
        `Last checked: ${
          hours === 0 ? `${minutes} minutes` : `${hours} hours`
        } ago`,
        ToastAndroid.LONG
      );
    } else {
      ToastAndroid.show("Never checked", ToastAndroid.LONG);
    }
  };

  return (
    <ScrollView>
      <BatteryOptimizationWarning />
      <List.Section title={t("general")}>
        <TouchableRipple
          onPress={() => {
            router.navigate("/language");
          }}
        >
          <List.Item
            title={t("language")}
            left={(props) => <List.Icon {...props} icon="translate" />}
          />
        </TouchableRipple>
        {Platform.OS === "android" && (
          <>
            <TouchableRipple
              onPress={toggleNotificationEnabled}
              onLongPress={showLastExecution}
            >
              <List.Item
                title={t("wishlist.notification.name")}
                description={t("wishlist.notification.info")}
                left={(props) => (
                  <List.Icon {...props} icon="cellphone-message" />
                )}
                right={() => (
                  <Checkbox
                    status={notificationEnabled ? "checked" : "unchecked"}
                    onPress={toggleNotificationEnabled}
                  />
                )}
              />
            </TouchableRipple>
            <TouchableRipple disabled={isDonator} onPress={showDonatePopup}>
              <List.Item
                title={t("donate")}
                description={
                  isDonator && (
                    <Text style={{ color: "green" }}>
                      {t("donate_unlocked")}
                    </Text>
                  )
                }
                left={(props) => <List.Icon {...props} icon="hand-coin" />}
              />
            </TouchableRipple>
          </>
        )}
      </List.Section>
      <List.Section title={t("links")}>
        <TouchableRipple
          onPress={() => Linking.openURL("https://vshop.one/discord")}
        >
          <List.Item
            title={t("discord_server")}
            left={(props) => <List.Icon {...props} icon="link" />}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() => Linking.openURL("https://vshop.one/credits")}
        >
          <List.Item
            title={t("credits")}
            left={(props) => <List.Icon {...props} icon="link" />}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() => Linking.openURL("https://vshop.one/privacy")}
        >
          <List.Item
            title={t("privacy_policy")}
            left={(props) => <List.Icon {...props} icon="link" />}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() =>
            Linking.openURL(
              "https://support-valorant.riotgames.com/hc/en-us/articles/360050328414-Deleting-Your-Riot-Account-and-All-Your-Data"
            )
          }
        >
          <List.Item
            title={t("delete_account")}
            left={(props) => <List.Icon {...props} icon="link" />}
          />
        </TouchableRipple>
      </List.Section>
      <List.Section title={t("account")}>
        <TouchableRipple onPress={() => Clipboard.setStringAsync(user.id)}>
          <List.Item
            title={t("copy_riot_id")}
            left={(props) => <List.Icon {...props} icon="content-copy" />}
          />
        </TouchableRipple>
        <TouchableRipple onPress={handleLogout}>
          <List.Item
            title={t("logout")}
            left={(props) => <List.Icon {...props} icon="logout" />}
          />
        </TouchableRipple>
      </List.Section>
      {__DEV__ && (
        <List.Section title="Development">
          <TouchableRipple onPress={toggleScreenshotMode}>
            <List.Item
              title={t("screenshot_mode")}
              left={(props) => (
                <List.Icon {...props} icon="cellphone-screenshot" />
              )}
              right={() => (
                <Checkbox
                  status={screenshotModeEnabled ? "checked" : "unchecked"}
                  onPress={toggleScreenshotMode}
                />
              )}
            />
          </TouchableRipple>
          <TouchableRipple onPress={() => checkShop(wishlistedSkins)}>
            <List.Item
              title="Wishlist notification test"
              left={(props) => (
                <List.Icon {...props} icon="cellphone-message" />
              )}
            />
          </TouchableRipple>
        </List.Section>
      )}

      <Text
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "gray",
          marginTop: 5,
          paddingHorizontal: 15,
        }}
      >
        VShop is not endorsed by Riot Games in any way.
        {"\n"}
        Riot Games, Valorant, and all associated properties are trademarks or
        registered trademarks of Riot Games, Inc.
      </Text>
    </ScrollView>
  );
}

export default Settings;
