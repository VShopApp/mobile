import { API_URL } from "@env";
import axios from "axios";

export const checkDonator = async (riotId: string) => {
  try {
    const res = await axios.request({
      url: `${API_URL}/user/${riotId}`,
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
    url: `${API_URL}/stripe/currencies`,
    method: "GET",
  });

  return res.data as ICurrency[];
};
