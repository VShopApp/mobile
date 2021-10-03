import React, { PropsWithChildren } from "react";
import { Appbar } from "react-native-paper";
import { Platform } from "react-native";
import { Menu } from "react-native-paper";
import * as Linking from "expo-linking";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

interface props {}
const AppBar = (props: PropsWithChildren<props>) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar>
      <Appbar.Content title="VShop" subtitle={"for Valorant"} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action icon={MORE_ICON} onPress={openMenu} color="#fff" />
        }
      >
        <Menu.Item
          onPress={() => {
            Linking.openURL("https://vshop.vasc.dev/changelog");
          }}
          title="Changelog"
        />
        <Menu.Item
          onPress={() => {
            Linking.openURL("https://vshop.vasc.dev/privacy");
          }}
          title="Privacy Policy"
        />
      </Menu>
    </Appbar>
  );
};

export default AppBar;
