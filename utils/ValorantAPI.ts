import { atob } from "./misc";

export let sUsername = "";
export let sRegion = "eu";
export let sAccessToken = "";
export let sEntitlementsToken = "";

let mfaCookie: any[] = [];

export async function login(
  username: string,
  password: string,
  accessToken?: string,
  entitlementsToken?: string
) {
  if (
    !accessToken ||
    !entitlementsToken ||
    (accessToken && entitlementsToken && isTokenExpired(accessToken))
  ) {
    const res = await fetch(getUrl("login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const json = await res.json();

    if (json.success) {
      sUsername = username;
      sAccessToken = json.accessToken;
      sEntitlementsToken = json.entitlementsToken;

      return {
        success: true,
        accessToken: json.accessToken,
        entitlementsToken: json.entitlementsToken,
      };
    } else if (json.mfaRequired) {
      mfaCookie = json.cookie;
      sUsername = username;
      return {
        mfaRequired: true,
        mfaEmail: json.mfaEmail,
      };
    } else if (json.error === "auth_failure") {
      return {
        success: false,
        error: "Your username or password is incorrect",
      };
    } else if (json.error === "rate_limited") {
      return {
        success: false,
        error: "Thats a little to fast, please try again later.",
      };
    } else {
      return {
        success: false,
        error: "An unknown error occured",
      };
    }
  } else if (accessToken && entitlementsToken) {
    sUsername = username;
    sAccessToken = accessToken;
    sEntitlementsToken = entitlementsToken;

    return {
      success: true,
    };
  }
}

export async function submitMfaCode(code: string) {
  const res = await fetch(getUrl("mfa"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cookie: mfaCookie,
      code,
    }),
  });

  const json = await res.json();

  if (json.success) {
    sAccessToken = json.accessToken;
    sEntitlementsToken = json.entitlementsToken;
    mfaCookie = [];
    return {
      success: true,
      accessToken: json.accessToken,
      entitlementsToken: json.entitlementsToken,
    };
  } else {
    return {
      success: false,
      error: json.error,
    };
  }
}

export async function getShop(region: string) {
  const res = await fetch(getUrl("shop"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      riotaccesstoken: sAccessToken,
      riotentitlementstoken: sEntitlementsToken,
      region,
    },
  });

  const json = await res.json();

  if (json.success) {
    return {
      success: true,
      shop: json.shop,
      bundle: json.bundle,
    };
  } else {
    return {
      success: false,
      error: json.error,
    };
  }
}

export async function getNightMarket(region: string) {
  const res = await fetch(getUrl("nightMarket"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      riotaccesstoken: sAccessToken,
      riotentitlementstoken: sEntitlementsToken,
      region,
    },
  });

  const json = await res.json();

  if (json.success) {
    return {
      success: true,
      nightMarket: json.nightMarket,
    };
  } else {
    return {
      success: false,
      error: json.error,
    };
  }
}

export function setSRegion(region: string) {
  sRegion = region.toLowerCase();
}

export function reset() {
  sUsername = "";
  sRegion = "";
  sAccessToken = "";
  sEntitlementsToken = "";
  mfaCookie = [];
}

export function isTokenExpired(token: string) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload)).exp < Date.now() / 1000;
}

function getUrl(name: string) {
  const baseUrl = !__DEV__ ? "http://10.0.2.2:3000" : "https://api.vshop.one";

  const endpoints: any = {
    login: "/login",
    mfa: "/login/mfa",
    shop: "/shop",
    nightMarket: "/nightmarket",
    progress: "/progress",
    wallet: "/wallet",
  };

  return `${baseUrl}${endpoints[name]}`;
}
