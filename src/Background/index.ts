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
      chrome.tabs.create({ url: APP_URL });
      chrome.notifications.clear(id);
    });

    chrome.runtime.onStartup.addListener(() => {
      console.log("Extension started");
      this.store.dispatch(getEarthquakes());
    });

    this.FirebaseListener();
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
