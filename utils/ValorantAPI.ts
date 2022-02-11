import { Platform } from "react-native";
import axios from "axios";
const RCTNetworkingAndroid = require("react-native/Libraries/Network/RCTNetworking.android");
const RCTNetworkingIOS = require("react-native/Libraries/Network/RCTNetworking.ios");

export var offers: any = {};
var cachedBundle: Bundle | null;
var cachedShop: singleItem[] | null;
var cachedNightMarket: singleNightMarketItem[] | null;

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
    }).catch(() => {
      return {
        data: {
          error: "rate_limited",
        },
      };
    })
  ).data;

  if (response.error === "auth_failure")
    return {
      error: "An auth error occurred, are the given credentials valid?",
    };
  else if (response.error === "rate_limited")
    return { error: "You have been rate limited, please try again later." };
  else if (response.type === "multifactor") {
    return { mfaRequired: true, mfaEmail: response.multifactor.email };
  } else if (response.type === "response") {
    return await setupUser(username, response, region);
  } else {
    return { error: "Oops, an unkown error occoured." };
  }
}

export async function submitMfaCode(
  username: string,
  code: string,
  region: string
) {
  let response: any = (
    await axios({
      url: getUrl("auth"),
      method: "PUT",
      data: {
        type: "multifactor",
        code: code,
        rememberDevice: false,
      },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
  ).data;

  if (response.type === "response") {
    return await setupUser(username, response, region);
  } else if (response.error === "multifactor_attempt_failed") {
    return { error: "The MFA code is invalid." };
  } else {
    return { error: "Oops, an unkown error occoured." };
  }
}

async function setupUser(username: string, response: any, region: string) {
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

export function clearCookies() {
  /* CLEAR COOKIES; MAN THIS WAS A PAIN TO FIND OUT */
  if (Platform.OS === "ios") {
    RCTNetworkingIOS.clearCookies(() => {});
  } else {
    RCTNetworkingAndroid.clearCookies(() => {});
  }
}

export async function getShop(user: user) {
  if (cachedShop) return cachedShop;

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

  cachedShop = singleItems;
  return singleItems as singleItem[];
}

export async function getNightMarket(user: user) {
  if (cachedNightMarket) return cachedNightMarket;

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

  var nightShop = shop.BonusStore.BonusStoreOffers;
  if (!nightShop) return []; // Hopefully this works, bc idk what the api returns if there is no night shop

  var arr = [];
  for (var i = 0; i < nightShop.length; i++) {
    let itemid = nightShop[i].Offer.Rewards[0].ItemID;
    arr[i] = (
      (
        await axios({
          url: `https://valorant-api.com/v1/weapons/skinlevels/${itemid}`,
          method: "GET",
        })
      ).data as any
    ).data;
    arr[i].price =
      nightShop[i].Offer.Cost["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"];
    arr[i].discountPrice =
      nightShop[i].DiscountCosts["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"];
    arr[i].discountPercent = nightShop[i].DiscountPercent;
  }

  cachedNightMarket = arr;

  return arr as singleNightMarketItem[];
}

export async function getBundle(user: user) {
  if (cachedBundle) return cachedBundle;

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

  let bundle: Bundle = (
    (
      await axios({
        url: `https://valorant-api.com/v1/bundles/${shop.FeaturedBundle.Bundle.DataAssetID}`,
        method: "GET",
      })
    ).data as any
  ).data;

  bundle.price = shop.FeaturedBundle.Bundle.Items.map(
    (item: any) => item.DiscountedPrice
  ).reduce((a: any, b: any) => a + b);

  cachedBundle = bundle;

  return bundle;
}

export async function loadOffers(user: user) {
  let response: any = (
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

export function resetCache() {
  cachedShop = null;
  cachedNightMarket = null;
  cachedBundle = null;
}

function getUrl(name: string, region?: string, userid?: string) {
  const URLS: any = {
    auth: "https://auth.riotgames.com/api/v1/authorization",
    entitlements: "https://entitlements.auth.riotgames.com/api/token/v1",
    userinfo: "https://auth.riotgames.com/userinfo",
    storefront: `https://pd.${region}.a.pvp.net/store/v2/storefront/${userid}`,
    wallet: `https://pd.${region}.a.pvp.net/store/v1/wallet/${userid}`,
    weapons: "https://valorant-api.com/v1/weapons",
    offers: `https://pd.${region}.a.pvp.net/store/v1/offers`,
    playerId: `https://pd.${region}.a.pvp.net/name-service/v2/players`,
  };

  return URLS[name];
}
