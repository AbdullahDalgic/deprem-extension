import { ExtendedStore, diffDeep } from "reduxed-chrome-storage";
import reduxStorage, { RootState } from "@src/tools/redux";
import { API_URL, APP_URL, FCM_SENDER_ID } from "@src/tools/constants";
import {
  IEarthquake,
  setEarthquakeSeen,
  getEarthquakes,
  setEarthquake,
} from "@src/tools/redux/slices/earthquakes";
import { i18n } from "@src/tools/helpers";
import { sendToken } from "@src/tools/redux/slices/device";
import { setLastWork } from "@src/tools/redux/slices/alarms";

class BackgroundJS {
  protected store: ExtendedStore;
  protected previous: RootState;
  protected storage: RootState;

  constructor() {
    console.log("BackgroundJS class is instantiated");
    this.Listeners();
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
      let clickUrl = APP_URL;
      const find = this.storage.earthquakes.data.find(
        (e: IEarthquake) => e.eventId.toString() === id
      );
      if (find) {
        clickUrl = `${APP_URL}/deprem/${find.eventId}`;
      }
      chrome.tabs.create({ url: clickUrl });
      chrome.notifications.clear(id);
    });

    chrome.runtime.onStartup.addListener(() => {
      console.log("Extension started");
      this.store.dispatch(getEarthquakes());
    });

    chrome.alarms.create("alarm", { periodInMinutes: 1 / 60 });
    chrome.alarms.onAlarm.addListener(this.AlarmListener);

    this.FirebaseListener();
  };

  protected AlarmListener = (alarm: chrome.alarms.Alarm) => {
    if (alarm.name === "alarm") {
      const now = new Date();
      const { lastWork, apiCallTime } = this.storage.alarms;
      if (!lastWork) return this.store.dispatch(setLastWork());

      /**
       * iki zaman arasindaki farki al
       * eger fark belirlenen zamandan buyukse bir suredir veri cekilmiyor demektir
       * ve veri cekme islemi baslatilir
       */
      const diff = now.getTime() - new Date(lastWork).getTime();
      if (diff > apiCallTime) {
        this.store.dispatch(getEarthquakes());
      }

      this.store.dispatch(setLastWork());
    }
  };

  protected FirebaseListener = () => {
    chrome.gcm.register([FCM_SENDER_ID], (token) => {
      this.store.dispatch(sendToken(token));
      chrome.runtime.setUninstallURL(`${API_URL}/unregister/${token}`);
    });

    chrome.gcm.onMessage.addListener((message) => {
      const { data } = message as any;
      const deprem = JSON.parse(data.deprem);

      if (!this.IsItVisible(deprem)) {
        this.store.dispatch(setEarthquakeSeen(deprem));
      } else {
        this.store.dispatch(setEarthquake(deprem));
        this.SendNotification(deprem);
      }
    });
  };

  protected StorageListener = async (changed: { [key: string]: any }) => {
    this.storage = this.store.getState() as RootState;

    // console.log("🚀 ~ changed:", changed);
    if (changed?.earthquakes?.unseen !== undefined) {
      let unseen = changed.earthquakes.unseen ?? 0;
      if (!unseen) unseen = "";
      chrome.action.setBadgeText({
        text: unseen.toString(),
      });
    }
  };

  protected SendNotification = (data: IEarthquake) => {
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

  protected IsItVisible = (data: IEarthquake) => {
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
