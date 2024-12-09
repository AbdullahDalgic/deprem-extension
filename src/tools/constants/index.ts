export const API_URL = "https://api.deprem.wiki/api";
export const APP_URL = "https://www.deprem.wiki";

export const TIME_FORMAT = "DD.MM.YYYY HH:mm:ss";

export const firebaseConfig = {
  apiKey: process.env.apiKey || "",
  authDomain: process.env.authDomain || "",
  projectId: process.env.projectId || "",
  storageBucket: process.env.storageBucket || "",
  messagingSenderId: process.env.messagingSenderId || "",
  appId: process.env.appId || "",
  measurementId: process.env.measurementId || "",
};
