import { getMessaging } from "firebase/messaging/sw"; // note: we MUST use the sw version of the messaging API and NOT the one from "firebase/messaging"
import { getToken } from "firebase/messaging";
import { firebase } from "./config";
import reduxStorage from "../redux";
import { sendToken } from "../redux/slices/device";
import { API_URL } from "../constants";

declare global {
  interface Window {
    registration: any;
  }
}

export const firebaseTokenRegister = async (): Promise<string> => {
  const store = await reduxStorage();
  const token = await getToken(getMessaging(firebase), {
    serviceWorkerRegistration: self.registration,
  });
  store.dispatch(sendToken(token));
  chrome.runtime.setUninstallURL(`${API_URL}/unregister/${token}`);
  return token;
};
