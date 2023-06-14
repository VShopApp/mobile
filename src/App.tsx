import React from "react";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import {
  Appbar,
  DarkTheme as PaperDarkTheme,
  Provider as PaperProvider,
  Text,
} from "react-native-paper";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import merge from "deepmerge";
import { Image, SafeAreaView, View, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { version } from "../package.json";
import { useTranslation, withTranslation } from "react-i18next";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useUserStore } from "./stores/user";
import MediaPopup from "./components/popups/MediaPopup";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY, STRIPE_PUBLIC_KEY_TEST } from "./utils/constants";
import UpdatePopup from "./components/popups/UpdatePopup";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import messaging from "@react-native-firebase/messaging";

import BundlesScreen from "./screens/Bundles";
import ShopScreen from "./screens/Shop";
import NightMarketScreen from "./screens/NightMarket";
import AccountScreen from "./screens/Account";
import SettingsScreen from "./screens/Settings";
import LanguageScreen from "./screens/Language";
import Wizard from "./screens/Wizard";
import SplashScreen from "./screens/Splash";
import ReAuthScreen from "./screens/ReAuth";
import DonatePopup from "./components/popups/DonatePopup";
import GalleryScreen from "./screens/Gallery";

export const CombinedDarkTheme = {
  ...merge(PaperDarkTheme, NavigationDarkTheme),
  colors: {
    ...merge(PaperDarkTheme.colors, NavigationDarkTheme.colors),
    primary: "#fa4454",
    accent: "#fa4454",
  },
};
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  return (
    <>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            paddingVertical: 20,
          }}>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              marginRight: 10,
            }}
            source={require("../assets/logo-50.png")}
          />
          <View>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>VShop</Text>
            <Text style={{ fontSize: 12 }}>v{version}</Text>
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </>
  );
}

function AppScreen() {
  const { user, setUser } = useUserStore(({ user, setUser }) => ({
    user,
    setUser,
  }));
  const { t } = useTranslation();

  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerContent user={user} setUser={setUser} {...props} />
        )}
        screenOptions={{
          header: ({ options, navigation }) => (
            <Appbar.Header
              style={{ backgroundColor: CombinedDarkTheme.colors.primary }}>
              <Appbar.Action icon="menu" onPress={navigation.openDrawer} />
              <Appbar.Content title={options.title} />
            </Appbar.Header>
          ),
        }}>
        <Drawer.Screen
          name="bundles"
          component={BundlesScreen}
          options={{
            title: t("bundles"),
            drawerIcon: ({ color, size }) => (
              <Icon name="package" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="shop"
          component={ShopScreen}
          options={{
            title: t("shop"),
            drawerIcon: ({ color, size }) => (
              <Icon name="basket" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="nightmarket"
          component={NightMarketScreen}
          options={{
            title: t("nightmarket"),
            drawerIcon: ({ color, size }) => (
              <Icon name="weather-night" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          component={AccountScreen}
          options={{
            title: t("profile"),
            drawerIcon: ({ color, size }) => (
              <Icon name="account" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="gallery"
          component={GalleryScreen}
          options={{
            title: t("gallery"),
            drawerIcon: ({ color, size }) => (
              <Icon name="camera-burst" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          children={() => <SettingsScreen />}
          options={{
            title: t("settings"),
            drawerIcon: ({ color, size }) => (
              <Icon name="cog" color={color} size={size} />
            ),
          }}
        />
      </Drawer.Navigator>
      {Platform.OS === "android" && <DonatePopup />}
      <MediaPopup />
    </>
  );
}

const Stack = createNativeStackNavigator();

function Navigation() {
  const { t } = useTranslation();

  // React.useEffect(() => {
  //   messaging()
  //     .getToken()
  //     .then((token) => console.log(token));
  // }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={{ backgroundColor: CombinedDarkTheme.colors.primary }}
      />
      <PaperProvider theme={CombinedDarkTheme}>
        <StripeProvider
          publishableKey={__DEV__ ? STRIPE_PUBLIC_KEY_TEST : STRIPE_PUBLIC_KEY}>
          <NavigationContainer theme={CombinedDarkTheme}>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: CombinedDarkTheme.colors.primary,
                },
                headerTintColor: "#fff",
                header: ({ options, navigation }) => (
                  <Appbar.Header
                    style={{
                      backgroundColor: CombinedDarkTheme.colors.primary,
                    }}>
                    <Appbar.BackAction onPress={navigation.goBack} />
                    <Appbar.Content title={options.title} />
                  </Appbar.Header>
                ),
                gestureEnabled: false,
              }}
              initialRouteName="splash">
              <Stack.Screen
                name="splash"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="reauth"
                component={ReAuthScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="wizard"
                component={Wizard}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="app"
                component={AppScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="language"
                options={{ title: t("language") }}
                component={LanguageScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </StripeProvider>
        {Platform.OS === "android" && <UpdatePopup />}
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default withTranslation()(Navigation);
