import React from "react";
import { BottomNavigation } from "react-native-paper";
import Shop from "./views/Shop";
import Settings from "./views/Settings";
import NightShop from "./views/NightShop";

interface props {
  user: user;
  setUser: Function;
}
export default function Navigation(props: props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "shop", title: "Shop", icon: "basket" },
    { key: "nightshop", title: "Night Shop", icon: "weather-night" },
    { key: "settings", title: "Settings", icon: "cog" },
  ]);

  const renderScene = ({ route, jumpTo }: any) => {
    switch (route.key) {
      case "shop":
        return <Shop user={props.user} />;
      case "nightshop":
        return <NightShop user={props.user} />;
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
