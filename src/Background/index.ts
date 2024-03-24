import { ExtendedStore, diffDeep } from "reduxed-chrome-storage";
import reduxStorage, { RootState } from "@src/tools/redux";
import { APP_URL, SOCKET_URL } from "@src/tools/constants";
import {
  IEarthquake,
  setEarthquakeSeen,
  getEarthquakes,
  setEarthquake,
} from "@src/tools/redux/slices/earthquakes";
import { i18n } from "@src/tools/helpers";

const io = require("socket.io-client");

class BackgroundJS {
  protected store: ExtendedStore;
  protected previous: RootState;
  protected storage: RootState;
  protected socket;

  constructor() {
    console.log("BackgroundJS class is instantiated");
    this.Listeners();

    this.SocketService();
  }

  protected Listeners = async () => {
    this.store = await reduxStorage();
    this.storage = this.store.getState() as RootState;
    this.store.subscribe(() => {
      this.previous = this.storage;
      this.storage = this.store.getState() as RootState;

      const changed = diffDeep(this.storage, this.previous);
      if (changed === undefined) return;
      this.StorageListener(changed);
    });

    chrome.notifications.onClicked.addListener((id) => {
      console.log("Notification clicked", id);
      chrome.tabs.create({ url: APP_URL });
      chrome.notifications.clear(id);
    });

    chrome.runtime.onStartup.addListener(() => {
      console.log("Extension started");
      this.store.dispatch(getEarthquakes());
      this.SocketService();
    });
  };

  public SocketService = () => {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.store.dispatch(getEarthquakes());
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("ping", (data: any) => {
      console.log("Socket ping");
    });

    this.socket.on("yeni-deprem", (data: any) => {
      console.log("Socket message", data);

      if (!this.IsItVisible(data)) {
        this.store.dispatch(setEarthquakeSeen(data));
      } else {
        this.store.dispatch(setEarthquake(data));
        this.SendNotification(data);
      }
    });
  };

  private StorageListener = async (changed: { [key: string]: any }) => {
    this.storage = this.store.getState() as RootState;

    console.log("🚀 ~ changed:", changed);
    if (changed?.earthquakes?.unseen !== undefined) {
      let unseen = changed.earthquakes.unseen ?? 0;
      if (!unseen) unseen = "";
      chrome.action.setBadgeText({
        text: unseen.toString(),
      });
    }
  };

  private SendNotification = (data: IEarthquake) => {
    // when clicked, open the www.deprem.wiki
    chrome.notifications.create(data.eventId.toString(), {
      type: "basic",
      iconUrl: chrome.runtime.getURL("assets/icon.png"),
      title: i18n("notification_title"),
      message: i18n("notification_body", [
        data.magnitude.toString(),
        data.location,
      ]),
      isClickable: true,
    });
  };

  private IsItVisible = (data: IEarthquake) => {
    let { magnitude, notification } = this.storage.settings;
    const NotificationValue = Number(notification.selected.value);
    const SizeValue = Number(magnitude.selected.value);
    const Magnitude = Number(data.magnitude);

    console.log("🚀 ~", { NotificationValue, SizeValue, Magnitude });

    if (!notification.selected.value) return false;
    if (!!NotificationValue && Magnitude < NotificationValue) return false;

    if (typeof SizeValue == "number") {
      if (Magnitude < SizeValue) return false;
    }

    return true;
  };
}

new BackgroundJS();
