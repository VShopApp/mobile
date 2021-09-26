import React, { PropsWithChildren } from "react";
import { Appbar } from "react-native-paper";

interface props {
  setView: Function;
  showActions: boolean;
}
const AppBar = (props: PropsWithChildren<props>) => (
  <Appbar>
    <Appbar.Content title="Valorant Shop" subtitle={"by vasc"} />
    {props.showActions && (
      <>
        <Appbar.Action
          color="#fff"
          icon="basket"
          onPress={() => props.setView(0)}
        />
        <Appbar.Action
          color="#fff"
          icon="cog"
          onPress={() => props.setView(1)}
        />
      </>
    )}
  </Appbar>
);

export default AppBar;
