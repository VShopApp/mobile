import axios from "axios";
import { useState } from "react";
import { Platform } from "react-native";
import { atob, VCurrencies } from "./misc";
const RCTNetworkingAndroid = require("react-native/Libraries/Network/RCTNetworking.android");
const RCTNetworkingIOS = require("react-native/Libraries/Network/RCTNetworking.ios");

axios.interceptors.request.use(
  function (config) {
    console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export let sUsername: string = "";
export let sAccessToken: string = "";
export let sEntitlementsToken: string = "";
export let sUserId: string = "";
export let sRegion: string = "eu";

export let offers: any = {};

let mfaCookie: any = "";

export let sShop: shopItem[] = [];
export let sBundle: Bundle;
export let sNightMarket: nightMarketItem[] = [];
export let sBalance: Balance;
export let sProgress: Progress;

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
      if (res2.data.error === "auth_failure") {
        return {
          success: false,
          error: "Wrong username or password.",
        };
      }

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
      sAccessToken = res2.data.response.parameters.uri.match(
        /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/
      )[1];

      const res3 = await axios({
        url: getUrl("entitlements"),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sAccessToken}`,
        },
        data: {},
      });
      sEntitlementsToken = res3.data.entitlements_token;

      const res4 = await axios({
        url: getUrl("userinfo"),
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sAccessToken}`,
        },
      });

      sUserId = res4.data.sub;

      await loadOffers();
      await loadShops();
      await loadBalance();
      await loadProgress();

      return {
        success: true,
      };
    }
  } else if (accessToken && entitlementsToken) {
    const res = await axios({
      url: getUrl("userinfo"),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    sUserId = res.data.sub;

    sAccessToken = accessToken;
    sEntitlementsToken = entitlementsToken;

    await loadOffers();
    await loadShops();
    await loadBalance();
    await loadProgress();

    return {
      success: true,
    };
  }
}

export async function submitMfaCode(mfaCode: string) {
  const res1 = await axios({
    url: getUrl("auth"),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      type: "multifactor",
      code: mfaCode,
      rememberDevice: false,
    },
    withCredentials: true,
  });

  if (res1.data.type === "response") {
    sAccessToken = res1.data.response.parameters.uri.match(
      /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/
    )[1];

    let res2 = await axios({
      url: getUrl("entitlements"),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sAccessToken}`,
      },
      data: {},
    });
    sEntitlementsToken = res2.data.entitlements_token;

    const res3 = await axios({
      url: getUrl("userinfo"),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sAccessToken}`,
      },
    });

    sUserId = res3.data.sub;

    await loadOffers();
    await loadShops();
    await loadBalance();
    await loadProgress();

    return {
      success: true,
    };
  } else if (res1.data.type) {
    return { success: false, error: res1.data.type };
  } else {
    return { success: false, error: "unknown" };
  }
}

export async function loadOffers() {
  const res = await axios({
    url: getUrl("offers"),
    method: "GET",
    headers: {
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  for (var i = 0; i < res.data.Offers.length; i++) {
    let offer = res.data.Offers[i];
    offers[offer.OfferID] = offer.Cost["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"];
  }
}

async function loadShops() {
  const res = await axios({
    url: getUrl("storefront"),
    method: "GET",
    headers: {
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  /* NORMAL SHOP */
  let singleItemOffers = res.data.SkinsPanelLayout.SingleItemOffers;
  let shop: shopItem[] = [];
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
  sShop = shop;

  /* BUNDLE */
  let bundle: Bundle = (
    await axios({
      url: `https://valorant-api.com/v1/bundles/${res.data.FeaturedBundle.Bundle.DataAssetID}`,
      method: "GET",
    })
  ).data.data;

  bundle.price = res.data.FeaturedBundle.Bundle.Items.map(
    (item: any) => item.DiscountedPrice
  ).reduce((a: any, b: any) => a + b);

  sBundle = bundle;

  /* NIGHT MARKET */
  var bonusStore = res.data.BonusStore.BonusStoreOffers;
  var nightMarket: nightMarketItem[] = [];
  for (var i = 0; i < bonusStore.length; i++) {
    let itemid = bonusStore[i].Offer.Rewards[0].ItemID;
    nightMarket[i] = (
      await axios({
        url: `https://valorant-api.com/v1/weapons/skinlevels/${itemid}`,
        method: "GET",
      })
    ).data.data;
    nightMarket[i].price = bonusStore[i].Offer.Cost[VCurrencies.VP];
    nightMarket[i].discountPrice = bonusStore[i].DiscountCosts[VCurrencies.VP];
    nightMarket[i].discountPercent = bonusStore[i].DiscountPercent;
  }
  sNightMarket = nightMarket;
}

export async function loadBalance() {
  const res = await axios({
    url: getUrl("wallet"),
    method: "GET",
    headers: {
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  sBalance = {
    vp: res.data.Balances[VCurrencies.VP],
    rad: res.data.Balances[VCurrencies.RAD],
    fag: res.data.Balances[VCurrencies.FAG],
  };
}

export async function loadProgress() {
  const res = await axios({
    url: getUrl("playerxp"),
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Riot-Entitlements-JWT": sEntitlementsToken,
      Authorization: `Bearer ${sAccessToken}`,
    },
  });

  sProgress = {
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

function getUrl(name: string) {
  const URLS: any = {
    auth: "https://auth.riotgames.com/api/v1/authorization/",
    entitlements: "https://entitlements.auth.riotgames.com/api/token/v1/",
    userinfo: "https://auth.riotgames.com/userinfo/",
    storefront: `https://pd.${sRegion}.a.pvp.net/store/v2/storefront/${sUserId}/`,
    wallet: `https://pd.${sRegion}.a.pvp.net/store/v1/wallet/${sUserId}/`,
    playerxp: `https://pd.${sRegion}.a.pvp.net/account-xp/v1/players/${sUserId}/`,
    weapons: "https://valorant-api.com/v1/weapons/",
    offers: `https://pd.${sRegion}.a.pvp.net/store/v1/offers/`,
    playerId: `https://pd.${sRegion}.a.pvp.net/name-service/v2/players/`,
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
