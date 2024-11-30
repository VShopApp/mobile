import axios from "axios";
import { getVAPILang } from "./localization";
import * as FileSystem from "expo-file-system";

type StoredAssets = {
  riotClientVersion?: string;
  skins: ValorantSkin[];
  buddies: ValorantBuddyAccessory[];
  sprays: ValorantSprayAccessory[];
  cards: ValorantCardAccessory[];
  titles: ValorantTitleAccessory[];
};

let assets: StoredAssets = {
  skins: [],
  buddies: [],
  sprays: [],
  cards: [],
  titles: [],
};
const FILE_LOCATION = FileSystem.cacheDirectory + "/valorant_assets.json";

export function getAssets() {
  return assets;
}

export async function loadAssets() {
  const { exists } = await FileSystem.getInfoAsync(FILE_LOCATION);
  const version = await fetchVersion();

  if (exists) {
    const storedAssets = await FileSystem.readAsStringAsync(FILE_LOCATION);
    const storedAssetsJson: StoredAssets = JSON.parse(storedAssets);

    if (storedAssetsJson.riotClientVersion === version) {
      assets = storedAssetsJson;

      return;
    }
  }

  assets.riotClientVersion = version;
  assets.skins = await fetchSkins();
  assets.buddies = await fetchBuddies();
  assets.sprays = await fetchSprays();
  assets.cards = await fetchPlayerCards();
  assets.titles = await fetchPlayerTitles();

  await FileSystem.writeAsStringAsync(FILE_LOCATION, JSON.stringify(assets));
}

export async function fetchVersion() {
  const res = await axios.request({
    url: "https://valorant-api.com/v1/version",
    method: "GET",
  });

  return res.data.data.riotClientVersion;
}

export async function fetchSkins() {
  const res = await axios.request<{ data: ValorantSkin[] }>({
    url: `https://valorant-api.com/v1/weapons/skins?language=${getVAPILang()}`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchBuddies() {
  const res = await axios.request<{ data: ValorantBuddyAccessory[] }>({
    url: `https://valorant-api.com/v1/buddies?language=${getVAPILang()}`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchSprays() {
  const res = await axios.request<{ data: ValorantSprayAccessory[] }>({
    url: `https://valorant-api.com/v1/sprays?language=${getVAPILang()}`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchPlayerCards() {
  const res = await axios.request<{ data: ValorantCardAccessory[] }>({
    url: `https://valorant-api.com/v1/playercards?language=${getVAPILang()}`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchPlayerTitles() {
  const res = await axios.request<{ data: ValorantTitleAccessory[] }>({
    url: `https://valorant-api.com/v1/playertitles?language=${getVAPILang()}`,
    method: "GET",
  });

  return res.data.data;
}

export async function fetchBundle(bundleId: string) {
  const res = await axios.request<{ data: ValorantBundle }>({
    url: `https://valorant-api.com/v1/bundles/${bundleId}?language=${getVAPILang()}`,
    method: "GET",
  });

  return res.data.data;
}
