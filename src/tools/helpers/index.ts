import { TIME_FORMAT } from "@src/tools/constants";
// import moment from "moment";
import moment from "moment-timezone";

export const i18n = (key: string, params?: string | string[]) => {
  return chrome.i18n.getMessage(key, params) || key;
};

export const getSystemLanguage = () => {
  return chrome.i18n.getUILanguage().replace("_", "-") || "tr-TR";
};

export const dateConvert = (_date: string, _timezone: string) => {
  const dateTimezone = _timezone || "Europe/Istanbul";
  const myTimezone = moment.tz.guess();

  // Verilen tarih ve saat bilgisini moment ile işleme alıyoruz
  const formattedDate = moment.tz(_date, TIME_FORMAT, dateTimezone);

  // Tarih ve saat bilgisini kullanıcı zaman dilimine çeviriyoruz
  const convertedDate = formattedDate.clone().tz(myTimezone);

  return convertedDate;
};
