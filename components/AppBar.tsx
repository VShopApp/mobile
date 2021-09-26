import React, { PropsWithChildren } from "react";
import { Appbar } from "react-native-paper";

interface props {
  setView: Function;
}
const AppBar = (props: PropsWithChildren<props>) => (
  <Appbar>
    <Appbar.Content title="Valorant Shop" subtitle={"by vasc"} />
    <Appbar.Action icon="basket" onPress={() => props.setView(0)} />
    <Appbar.Action icon="cog" onPress={() => props.setView(1)} />
  </Appbar>
);

export default AppBar;
