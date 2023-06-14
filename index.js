/**
 * @format
 */
import "./shim";
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";
import "./src/utils/localization";
import messaging from "@react-native-firebase/messaging";
import WishlistServiceTask from "./src/utils/WishlistServiceTask";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (__DEV__) console.log(`Received FCM: ${JSON.stringify(remoteMessage)}`);
  if (remoteMessage.data.task == "check_shop") await WishlistServiceTask();
});

AppRegistry.registerComponent(appName, () => App);
