import { getAccessTokenFromUri, getVAPILang } from "./misc";
import {
  getEntitlementsToken,
  getShop,
  getUserId,
  loadVersion,
  reAuth,
} from "./ValorantAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification from "react-native-push-notification";
import axios from "axios";
import i18n from "./localization";
import { useWishlistStore } from "../stores/wishlistNotification";
import { checkDonator } from "./VShopAPI";

export default async function ({ force = false }: { force: boolean }) {
  try {
    const lastWishlistCheck = Number.parseInt(
      (await AsyncStorage.getItem("lastWishlistCheck")) || "0",
    );
    const lastCheckedMs = new Date().getTime() - lastWishlistCheck;
    if (60 * 1000 < lastCheckedMs || lastWishlistCheck === 0 || force) {
      await AsyncStorage.setItem(
        "lastWishlistCheck",
        new Date().getTime().toString(),
      );
      await loadVersion();
      // Automatic cookies: https://github.com/facebook/react-native/issues/1274
      const res = await reAuth();
      const accessToken = getAccessTokenFromUri(
        res.data.response.parameters.uri,
      );
      const userId = getUserId(accessToken);

      // Check for donator
      const isDonator = await checkDonator(userId);
      if (!isDonator) return;

      const entitlementsToken = await getEntitlementsToken(accessToken);
      const region = (await AsyncStorage.getItem("region")) || "eu";
      const shop = await getShop(
        accessToken,
        entitlementsToken,
        region,
        userId,
      );

      PushNotification.createChannel(
        {
          channelId: "wishlist",
          channelName: "Wishlist",
        },
        async () => {
          await useWishlistStore.persist.rehydrate();
          const wishlist = useWishlistStore.getState().skinIds;
          var hit = false;
          for (let i = 0; i < wishlist.length; i++) {
            if (shop.SkinsPanelLayout.SingleItemOffers.includes(wishlist[i])) {
              const skinData = await axios.get<{
                status: number;
                data: ISkinLevel;
              }>(
                `https://valorant-api.com/v1/weapons/skinlevels/${
                  wishlist[i]
                }?language=${getVAPILang()}`,
              );
              PushNotification.localNotification({
                channelId: "wishlist",
                title: i18n.t("wishlist.name"),
                message: i18n.t("wishlist.notification.hit", {
                  displayname: skinData.data.data.displayName,
                }),
                bigPictureUrl: skinData.data.data.displayIcon,
                smallIcon: "ic_notification",
              });
              hit = true;
            }
          }
          if (!hit) {
            PushNotification.localNotification({
              channelId: "wishlist",
              title: i18n.t("wishlist.name"),
              message: i18n.t("wishlist.notification.no_hit"),
              smallIcon: "ic_notification",
            });
          }
        },
      );
    }
  } catch (e) {
    console.log(e);
    PushNotification.createChannel(
      {
        channelId: "wishlist",
        channelName: "Wishlist",
      },
      () => {
        PushNotification.localNotification({
          channelId: "wishlist",
          title: i18n.t("wishlist.name"),
          message: i18n.t("wishlist.notification.error"),
          smallIcon: "ic_notification",
        });
      },
    );
  }
}
