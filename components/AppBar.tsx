import React, { PropsWithChildren } from "react";
import { Appbar } from "react-native-paper";

interface props {}
const AppBar = (props: PropsWithChildren<props>) => (
  <Appbar>
    <Appbar.Content title="VShop" subtitle={"for Valorant"} />
  </Appbar>
);

export default AppBar;
