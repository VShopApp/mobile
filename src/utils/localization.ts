import i18n, { ModuleType } from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RNLocalize from "react-native-localize";
import languages from "../../assets/langs.json";
import axios from "axios";
import HttpBackend, { BackendOptions } from "i18next-http-backend";
import ChainedBackend from "i18next-chained-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import en from "../../assets/en.json";

export const langCodes = [
  "en",
  ...languages.map((language) => language.langCode),
];

const langDetector = {
  type: "languageDetector" as ModuleType,
  async: true,
  detect: (callback: any) => {
    AsyncStorage.getItem("language", (error, result) => {
      if (error || !result) {
        const lang =
          RNLocalize.findBestAvailableLanguage(langCodes)?.languageTag || "en";
        callback(lang);
      } else {
        callback(result);
      }
    });
  },
  init: () => {},
  cacheUserLanguage: (language: string) => {
    AsyncStorage.setItem("language", language);
  },
};

const localResources = {
  en: {
    translation: en,
  },
};

i18n
  .use(langDetector)
  .use(initReactI18next)
  .use(ChainedBackend)
  .init({
    compatibilityJSON: "v3",
    load: "currentOnly",
    supportedLngs: langCodes,
    fallbackLng: "en",
    backend: {
      backends: [resourcesToBackend(localResources), HttpBackend],
      backendOptions: [
        null,
        {
          loadPath: "https://i18n.vshop.one/{{lng}}.json",
          parse: (data: any) => {
            return data as any;
          },
          request: (options: any, url: any, payload: any, callback: any) => {
            axios
              .get(url)
              .then((res) => {
                callback(null, res);
              })
              .catch((err) => {
                callback(err, null as any);
              });
          },
        },
      ],
    } as BackendOptions,
    debug: false,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
