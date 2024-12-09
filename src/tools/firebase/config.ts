import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";
import { firebaseConfig } from "../constants";

export const firebase = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebase);
