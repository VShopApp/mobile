import axios from "axios";

export const getBackendUrl = () => {
  if (__DEV__) return "http://10.0.2.2:8000";
  return "https://api.vshop.one";
};

export const checkDonator = async (riotId: string) => {
  try {
    const res = await axios.request({
      url: `${getBackendUrl()}/user/${riotId}`,
      method: "GET",
      timeout: 5 * 1000,
    });

    return res.data.donator as boolean;
  } catch (e) {
    console.log(e);
  }
  return false;
};

export const getCurrencies = async () => {
  const res = await axios.request({
    url: `${getBackendUrl()}/stripe/currencies`,
    method: "GET",
  });

  return res.data as ICurrency[];
};
