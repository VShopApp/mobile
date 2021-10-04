import { Platform } from "react-native";
const RCTNetworkingAndroid = require("react-native/Libraries/Network/RCTNetworking.android");
const RCTNetworkingIOS = require("react-native/Libraries/Network/RCTNetworking.ios");

export var offers: any = {};

export async function login(
  username: string,
  password: string,
  region: string
) {
  clearCookies();

  await (
    await fetch(getUrl("auth"), {
      method: "POST",
      body: JSON.stringify({
        client_id: "play-valorant-web-prod",
        nonce: "1",
        redirect_uri: "https://playvalorant.com/opt_in",
        response_type: "token id_token",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  ).json();

  /* LOG IN */
  let response = await (
    await fetch(getUrl("auth"), {
      method: "PUT",
      body: JSON.stringify({
        type: "auth",
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  ).json();

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
    await (
      await fetch(getUrl("entitlements"), {
        method: "POST",
        body: "",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      })
    ).json()
  ).entitlements_token;

  /* UserId */
  const userId = (
    await (
      await fetch(getUrl("userinfo"), {
        method: "POST",
        body: "",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      })
    ).json()
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
  const shop = await (
    await fetch(getUrl("storefront", user.region, user.id), {
      method: "GET",
      headers: {
        "X-Riot-Entitlements-JWT": user.entitlementsToken,
        Authorization: `Bearer ${user.accessToken}`,
      },
      credentials: "include",
    })
  ).json();

  var singleItems = shop.SkinsPanelLayout.SingleItemOffers;

  for (var i = 0; i < singleItems.length; i++) {
    singleItems[i] = (
      await (
        await fetch(
          `https://valorant-api.com/v1/weapons/skinlevels/${singleItems[i]}`
        )
      ).json()
    ).data;
    singleItems[i].price = offers[singleItems[i].uuid];
  }

  return { singleItems } as shopItems;
}

export async function loadOffers(user: user) {
  const response = await (
    await fetch(getUrl("offers", user.region, user.id), {
      method: "GET",
      headers: {
        "X-Riot-Entitlements-JWT": user.entitlementsToken,
        Authorization: `Bearer ${user.accessToken}`,
      },
      credentials: "include",
    })
  ).json();

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
