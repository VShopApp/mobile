import React from "react";
import { BottomNavigation } from "react-native-paper";
import Shop from "../views/Shop";
import Settings from "../views/Settings";
import NightMarket from "../views/NightMarket";

interface props {
  user: user;
  setUser: Function;
}
export default function Navigation(props: props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "shop", title: "Shop", icon: "basket" },
    { key: "nightmarket", title: "Night Market", icon: "weather-night" },
    { key: "settings", title: "Settings", icon: "cog" },
  ]);

  const renderScene = ({ route, jumpTo }: any) => {
    switch (route.key) {
      case "shop":
        return <Shop user={props.user} />;
      case "nightmarket":
        return <NightMarket user={props.user} />;
      case "settings":
        return <Settings user={props.user} setUser={props.setUser} />;
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
