import axios from "axios";
import jwtDecode from "jwt-decode";
import { clearRTCCookies, VCurrencies } from "./misc";
import * as SecureStore from "expo-secure-store";

axios.interceptors.request.use(
  function (config) {
    console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export let sAccessToken: string = "";
export let sEntitlementsToken: string = "";
export let sUserId: string = "";
export let sRegion: string = "eu";
export let sUsername: string = "";

export let offers: any = {};

export let sShop: shopItem[] = [];
export let sBundle: Bundle;
export let sNightMarket: nightMarketItem[] = [];
export let sBalance: Balance;
export let sProgress: Progress;

export async function setup(accessToken: string, region: string) {
  sAccessToken = accessToken;

  sRegion = region;
  await SecureStore.setItemAsync("region", region);

  loadUserId();
  await loadEntitlementsToken();
  await loadOffers();
  await loadShops();
  await loadBalance();
  await loadProgress();
  await loadUsername();
}

async function loadEntitlementsToken() {
  const res = await axios({
    url: getUrl("entitlements"),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sAccessToken}`,
    },
    data: {},
  });

  sEntitlementsToken = res.data.entitlements_token;
}

function loadUserId() {
  const data = jwtDecode(sAccessToken) as any;

  sUserId = data.sub;
}

async function loadUsername() {
  const res = await axios({
    url: getUrl("name"),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: [sUserId],
  });

  sUsername = res.data[0].GameName != "" ? res.data[0].GameName : "?";
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
  if (res.data.BonusStore) {
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
      nightMarket[i].discountPrice =
        bonusStore[i].DiscountCosts[VCurrencies.VP];
      nightMarket[i].discountPercent = bonusStore[i].DiscountPercent;
    }
    sNightMarket = nightMarket;
  }
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
  sUserId = "";
  sRegion = "";
  sAccessToken = "";
  sEntitlementsToken = "";
  clearRTCCookies();
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
    name: `https://pd.${sRegion}.a.pvp.net/name-service/v2/players`,
  };

  return URLS[name];
}

export function isTokenExpired(token: string) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload)).exp < Date.now() / 1000;
}
