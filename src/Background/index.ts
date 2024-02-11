import { nanoid } from "@reduxjs/toolkit";
import { SOCKET_URL } from "@src/tools/constants";
import reduxedStore, { RootState } from "@src/tools/redux";
import {
  IEarthquake,
  getEarthquakes,
  setEarthquake,
  setEarthquakeSeen,
} from "@src/tools/redux/slices/earthquakes";
import { ExtendedStore, diffDeep } from "reduxed-chrome-storage";

const io = require("socket.io-client");

class BackgroundJS {
  protected store: ExtendedStore;
  protected state: RootState;
  protected previous: RootState;

  constructor() {
    console.log("Background created");

    this.init();
  }

  protected init() {
    this.SocketService();
    this.Listeners();
  }

  protected async Listeners() {
    this.store = await reduxedStore();
    this.state = this.store.getState();

    this.state = this.store.getState();
    this.store.subscribe(() => {
      this.previous = this.state;
      this.state = this.store.getState();

      const changed = diffDeep(this.state, this.previous);
      if (!changed) return;
      this.StorageListener(changed);
    });
  }

  /**
   * @description Bu fonksiyon, storage değişikliklerini dinler.
   *
   * @param changed
   */
  protected async StorageListener(changed: { [key: string]: any }) {
    console.log("🚀 ~ BackgroundJS ~ changed:", changed);
    if (changed?.earthquakes?.unseen !== undefined) {
      let unseen = changed.earthquakes.unseen.toString();
      if (unseen === "0") unseen = "";
      chrome.action.setBadgeText({ text: unseen });
    }
  }

  /**
   * @description Bu fonksiyon, socket bağlantısını sağlar.
   */
  protected SocketService() {
    console.log("SocketService created");

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      this.store.dispatch(getEarthquakes());
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("yeni-deprem", (data: IEarthquake) => {
      console.log("Socket yeni-deprem", data);

      if (!this.IsItVisible(data)) {
        this.store.dispatch(setEarthquakeSeen(data));
      } else {
        this.store.dispatch(setEarthquake(data));
        this.SendNotification(data);
      }
    });
  }

  /**
   * @description Bu fonksiyon, kullanıcıya deprem bildirimi gönderir.
   *
   * @param data
   */
  protected SendNotification(data: IEarthquake) {
    chrome.notifications.create(data.id || nanoid(), {
      type: "basic",
      iconUrl: chrome.runtime.getURL("assets/icon.png"),
      title: "Yeni Deprem",
      message: `${data.location} ${data.magnitude} büyüklüğünde deprem oldu.`,
      isClickable: true,
    });
  }

  /**
   * @description Bu fonksiyon, kullanıcının ayarlarına göre depremin görünüp görünmeyeceğini kontrol eder.
   *
   * @param data
   * @returns boolean
   */
  protected IsItVisible(data: IEarthquake) {
    console.log("IsItVisible -> data", data);

    let { size, notifications } = this.state.settings;
    const NotificationValue = Number(notifications.value.replace("+", ""));
    const Magnitude = Number(data.magnitude);
    const SizeValue = Number(size.value.replace("+", ""));

    if (size.value === "all" && notifications.value === "all") return true;
    if (notifications.value == "do_not_notify") return false;
    if (!!NotificationValue && Magnitude < NotificationValue) return false;
    if (typeof SizeValue === "number" && Magnitude < SizeValue) return false;

    return true;
  }
}

new BackgroundJS();
