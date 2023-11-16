import { config } from "./config.js";

export const getJSON = async (url, options) => {
  const data = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Accept': 'application/json',
    },
  });

  return data;
}