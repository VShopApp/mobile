import React, { PropsWithChildren } from "react";
import { Appbar } from "react-native-paper";
interface props {
  loggedIn: boolean;
}
const AppBar = (props: PropsWithChildren<props>) => {
  return (
    <Appbar>
      <Appbar.Content title="VShop" subtitle={"for Valorant"} />
    </Appbar>
  );
};

export default AppBar;
