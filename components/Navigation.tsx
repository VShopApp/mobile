import React, { PropsWithChildren } from "react";
import { BottomNavigation } from "react-native-paper";
import Shop from "../views/Shop";
import Settings from "../views/Settings";
import NightMarket from "../views/NightMarket";

interface props {
  setLoggedIn: Function;
}
export default function Navigation(props: PropsWithChildren<props>) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "shop", title: "Shop", icon: "basket" },
    { key: "nightmarket", title: "Night Market", icon: "weather-night" },
    { key: "settings", title: "Settings", icon: "cog" },
  ]);

  const renderScene = ({ route, jumpTo }: any) => {
    switch (route.key) {
      case "shop":
        return <Shop />;
      case "nightmarket":
        return <NightMarket />;
      case "settings":
        return <Settings setLoggedIn={props.setLoggedIn} />;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
