import axios from "axios";
import { Platform } from "react-native";
import { VCurrencies } from "./misc";
const RCTNetworkingAndroid = require("react-native/Libraries/Network/RCTNetworking.android");
const RCTNetworkingIOS = require("react-native/Libraries/Network/RCTNetworking.ios");

export let sUsername: string = "";
export let sAccessToken: string = "";
export let sEntitlementsToken: string = "";
export let sUserId: string = "";
export let sRegion: string = "eu";

let mfaCookie: any = "";

axios.defaults.withCredentials = true;

export async function login(
  username: string,
  password: string,
  region: string,
  accessToken?: string,
  entitlementsToken?: string
) {
  clearCookies();
  sUsername = username;
  sRegion = region;
  if (
    !accessToken ||
    !entitlementsToken ||
    (accessToken && entitlementsToken && isTokenExpired(accessToken))
  ) {
    let res1 = await axios({
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

    let res2 = await axios({
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
    });

    if (res2.data.error) {
      return {
        success: false,
        error: res2.data.error,
      };
    } else if (res2.data.type === "multifactor") {
      mfaCookie = res1.headers["set-cookie"]?.toString() as string;

      return {
        mfaRequired: true,
        mfaEmail: res2.data.multifactor.email,
      };
    } else if (res2.data.type === "response") {
      accessToken = res2.data.response.parameters.uri.match(
        /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/
      )[1];

      const res3 = await axios({
        url: getUrl("entitlements"),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: {},
      });
      entitlementsToken = res3.data.entitlements_token;

      const res4 = await axios({
        url: getUrl("userinfo"),
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      sUserId = res4.data.sub;

      return {
        success: true,
      };
    }
  } else if (accessToken && entitlementsToken) {
    sUserId = username;
    sAccessToken = accessToken;
    sEntitlementsToken = entitlementsToken;

    return {
      success: true,
    };
  }
}

export async function submitMfaCode(mfaCode: string) {
  var response = await axios({
    url: getUrl("auth"),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      type: "multifactor",
      code: mfaCode,
      rememberDevice: false,
    }),
    withCredentials: true,
  });

  if (response.data.type === "response") {
    sAccessToken = response.data.response.parameters.uri.match(
      /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/
    )[1];

    response = await axios({
      url: getUrl("entitlements"),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sAccessToken}`,
      },
    });
    sEntitlementsToken = response.data.entitlements_token;

    response = await axios({
      url: getUrl("userinfo"),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sAccessToken}`,
      },
    });

    sUserId = response.data.sub;

    return {
      success: true,
    };
  } else if (response.data.type) {
    return { success: false, error: response.data.type };
  } else {
    return { success: false, error: "unknown" };
  }
}

export async function getShop() {
  console.log(getUrl("storefront", sRegion, sUserId));
  const res = await axios({
    url: getUrl("storefront", sRegion, sUserId),
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  const res2 = await axios({
    url: getUrl("storefront", sRegion, sUserId),
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  let offers: { [offerId: string]: number } = {};
  for (var i = 0; i < res2.data.Offers.length; i++) {
    const offer = res2.data.Offers[i];
    offers[offer.OfferID] = offer.Cost[VCurrencies.VP];
  }

  let singleItemOffers = res.data.SkinsPanelLayout.SingleItemOffers;
  let shop: singleItem[] = [];
  for (var i = 0; i < singleItemOffers.length; i++) {
    shop[i] = (
      await axios(
        `https://valorant-api.com/v1/weapons/skinlevels/${singleItemOffers[i]}`,
        {
          method: "GET",
        }
      )
    ).data.data;
    shop[i].price = offers[shop[i].uuid];
  }

  let bundle: Bundle = (
    await axios({
      url: `https://valorant-api.com/v1/bundles/${res.data.FeaturedBundle.Bundle.DataAssetID}`,
      method: "GET",
    })
  ).data.data;

  bundle.price = res.data.FeaturedBundle.Bundle.Items.map(
    (item: any) => item.DiscountedPrice
  ).reduce((a: any, b: any) => a + b);

  return { shop, bundle };
}

export async function getNightMarket() {
  const res = await axios({
    url: getUrl("storefront", sRegion, sUserId),
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  if (!res.data.BonusStore) return [];
  var nightShop = res.data.BonusStore.BonusStoreOffers;

  var arr = [];
  for (var i = 0; i < nightShop.length; i++) {
    let itemid = nightShop[i].Offer.Rewards[0].ItemID;
    arr[i] = (
      await axios({
        url: `https://valorant-api.com/v1/weapons/skinlevels/${itemid}`,
        method: "GET",
      })
    ).data.data;
    arr[i].price = nightShop[i].Offer.Cost[VCurrencies.VP];
    arr[i].discountPrice = nightShop[i].DiscountCosts[VCurrencies.VP];
    arr[i].discountPercent = nightShop[i].DiscountPercent;
  }

  return arr as singleNightMarketItem[];
}

export async function getWallet() {
  const res = await axios({
    url: getUrl("wallet", sRegion, sUserId),
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  return {
    vp: res.data.Balances[VCurrencies.VP],
    rad: res.data.Balances[VCurrencies.RAD],
    fag: res.data.Balances[VCurrencies.FAG],
  };
}

export async function getProgress() {
  const res = await axios({
    url: getUrl("playerxp", sRegion, sUserId),
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  return {
    level: res.data.Progress.Level,
    xp: res.data.Progress.XP,
  };
}

export function reset() {
  sUsername = "";
  sUserId = "";
  sRegion = "";
  sAccessToken = "";
  sEntitlementsToken = "";
  mfaCookie = null;
}

function getUrl(name: string, region?: string, userId?: string) {
  const URLS: any = {
    auth: "https://auth.riotgames.com/api/v1/authorization/",
    entitlements: "https://entitlements.auth.riotgames.com/api/token/v1/",
    userinfo: "https://auth.riotgames.com/userinfo/",
    storefront: `https://pd.${region}.a.pvp.net/store/v2/storefront/${userId}`,
    wallet: `https://pd.${region}.a.pvp.net/store/v1/wallet/${userId}`,
    playerxp: `https://pd.${region}.a.pvp.net/account-xp/v1/players/${userId}`,
    weapons: "https://valorant-api.com/v1/weapons/",
    offers: `https://pd.${region}.a.pvp.net/store/v1/offers/`,
    playerId: `https://pd.${region}.a.pvp.net/name-service/v2/players/`,
  };

  return URLS[name];
}

export function clearCookies() {
  /* CLEAR COOKIES; MAN THIS WAS A PAIN TO FIND OUT */
  if (Platform.OS === "ios") {
    RCTNetworkingIOS.clearCookies(() => {});
  } else {
    RCTNetworkingAndroid.clearCookies(() => {});
  }
}

export function isTokenExpired(token: string) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload)).exp < Date.now() / 1000;
}
