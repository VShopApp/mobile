import { Platform } from "react-native";
import axios from "axios";
const RCTNetworkingAndroid = require("react-native/Libraries/Network/RCTNetworking.android");
const RCTNetworkingIOS = require("react-native/Libraries/Network/RCTNetworking.ios");

export var offers: any = {};

export async function login(
  username: string,
  password: string,
  region: string
) {
  clearCookies();

  await axios({
    url: getUrl("auth"),
    method: "POST",
    data: {
      client_id: "play-valorant-web-prod",
      nonce: "1",
      redirect_uri: "https://playvalorant.com/opt_in",
      response_type: "token id_token",
    },
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  /* LOG IN */
  let response: any = (
    await axios({
      url: getUrl("auth"),
      method: "PUT",
      data: {
        type: "auth",
        username,
        password,
      },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
  ).data;

  if (response.error === "auth_failure")
    return { error: "The given credentials are invalid." };
  else if (response.error === "rate_limited")
    return { error: "You have been rate limited, please try again later." };

  const uri = response["response"]["parameters"]["uri"];

  const regexResult = uri.match(
    /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/
  );
  const accessToken = regexResult[1];
  const idtoken = regexResult[2];
  const expiresIn = regexResult[3];

  /* Entitlements */
  const entitlementsToken = (
    (
      await axios({
        url: getUrl("entitlements"),
        method: "POST",
        data: {},
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
    ).data as any
  ).entitlements_token;

  /* UserId */
  const userId = (
    (
      await axios({
        url: getUrl("userinfo"),
        method: "POST",
        data: {},
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
    ).data as any
  ).sub;

  const user: user = {
    name: username,
    accessToken,
    entitlementsToken,
    idtoken,
    expiresIn,
    region,
    id: userId,
    loading: false,
  };

  await loadOffers(user);

  return user;
}

export async function clearCookies() {
  /* CLEAR COOKIES; MAN THIS WAS A PAIN TO FIND OUT */
  if (Platform.OS === "ios") {
    RCTNetworkingIOS.clearCookies(() => {});
  } else {
    RCTNetworkingAndroid.clearCookies(() => {});
  }
}

export async function getShop(user: user) {
  const shop: any = (
    await axios({
      url: getUrl("storefront", user.region, user.id),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Riot-Entitlements-JWT": user.entitlementsToken,
        Authorization: `Bearer ${user.accessToken}`,
      },
      withCredentials: true,
    })
  ).data;

  var singleItems = shop.SkinsPanelLayout.SingleItemOffers;

  for (var i = 0; i < singleItems.length; i++) {
    singleItems[i] = (
      (
        await axios({
          url: `https://valorant-api.com/v1/weapons/skinlevels/${singleItems[i]}`,
          method: "GET",
        })
      ).data as any
    ).data;
    singleItems[i].price = offers[singleItems[i].uuid];
  }

  return { singleItems } as shopItems;
}

export async function loadOffers(user: user) {
  const response: any = (
    await axios({
      url: getUrl("offers", user.region, user.id),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Riot-Entitlements-JWT": user.entitlementsToken,
        Authorization: `Bearer ${user.accessToken}`,
      },
      withCredentials: true,
    })
  ).data;

  for (var i = 0; i < response.Offers.length; i++) {
    let offer = response.Offers[i];
    offers[offer.OfferID] = offer.Cost["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"];
  }
}

function getUrl(name: string, region?: string, userid?: string) {
  const URLS: any = {
    auth: "https://auth.riotgames.com/api/v1/authorization",
    entitlements: "https://entitlements.auth.riotgames.com/api/token/v1",
    userinfo: "https://auth.riotgames.com/userinfo",
    storefront: `https://pd.${region}.a.pvp.net/store/v2/storefront/${userid}`,
    weapons: "https://valorant-api.com/v1/weapons",
    offers: `https://pd.${region}.a.pvp.net/store/v1/offers`,
    playerId: `https://pd.${region}.a.pvp.net/name-service/v2/players`,
  };

  return URLS[name];
}
