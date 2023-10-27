import axios from "axios"
import { IP_INFO_TOKEN } from "../config"

export const ipInfoApi =  () => {

  const data = axios.get("https://api.ipify.org/?format=json").then(async (response) => {

    const sp = await axios.get(`https://ipinfo.io/${response.data?.ip}/json/?token=${IP_INFO_TOKEN}`).then(
      (response) => response.data
    )

    return sp

  }).catch(() => null);

  return data
}