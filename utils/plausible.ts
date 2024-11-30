import axios from "axios";
import * as Device from "expo-device";
import * as Application from "expo-application";

let userAgent: string;
let appVersion: string;

// https://plausible.io/docs/events-api
export async function capture(
  name: "pageview" | "wishlist_check",
  path?: string
) {
  if (
    !process.env.EXPO_PUBLIC_PLAUSIBLE_URL ||
    !process.env.EXPO_PUBLIC_PLAUSIBLE_DOMAIN
  )
    return;

  if (!userAgent) {
    const osName = Device.osName || "Unknown OS";
    const osVersion = Device.osVersion || "Unknown Version";
    const modelName = Device.modelName || "Unknown Device";

    userAgent = `Mozilla/5.0 (${osName} ${osVersion}; ${modelName}) Gecko/20100101 Chrome/53.0`;
  }

  if (!appVersion) {
    appVersion = Application.nativeApplicationVersion || "Unknown Version";
  }

  await axios.request({
    url: `${process.env.EXPO_PUBLIC_PLAUSIBLE_URL}/api/event`,
    method: "POST",
    headers: {
      "User-Agent": userAgent,
      "Content-Type": "application/json",
    },
    data: {
      name,
      domain: process.env.EXPO_PUBLIC_PLAUSIBLE_DOMAIN,
      url: path ?? `app://localhost/${path}`,
      props: {
        app_version: appVersion,
      },
    },
  });
}
