export const i18n = (key: string) => {
  return chrome.i18n.getMessage(key) || key;
};
