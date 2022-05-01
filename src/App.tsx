import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import Login from "./views/Login";
import {
  DefaultTheme,
  Provider as PaperProvider,
  DarkTheme,
} from "react-native-paper";
import AppBar from "./components/AppBar";
import Navigation from "./components/Navigation";
import Update from "./components/Update";
import { registerRootComponent } from "expo";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const theme = {
    ...DefaultTheme,
    dark: true,
    roundness: 2,
    colors: {
      ...DarkTheme.colors,
      primary: "#fa4454",
      accent: "#fa4454",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ width: "100%", height: "100%" }}>
        <Update />
        <AppBar loggedIn={loggedIn !== undefined} />
        {!loggedIn ? (
          <Login setLoggedIn={setLoggedIn} />
        ) : (
          <Navigation setLoggedIn={setLoggedIn} />
        )}
        <StatusBar barStyle="default" />
      </SafeAreaView>
    </PaperProvider>
  );
}

registerRootComponent(App);
