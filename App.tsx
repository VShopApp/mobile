import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import Login from "./views/Login";
import {
  DefaultTheme,
  Provider as PaperProvider,
  DarkTheme,
} from "react-native-paper";
import AppBar from "./components/AppBar";
import SnackBar from "./components/SnackBar";
import Navigation from "./components/Navigation";
import Update from "./components/Update";
import Info from "./components/Info";

export default function App() {
  const [loggedIn, setLoggedIn] = useState<user>();
  const [snackbar, setSnackbar] = useState("");

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
        <Info />
        <Update />
        <AppBar loggedIn={loggedIn !== undefined} />
        {!loggedIn ? (
          <Login setLoggedIn={setLoggedIn} setSnackbar={setSnackbar} />
        ) : (
          <Navigation setLoggedIn={setLoggedIn} />
        )}
        <SnackBar
          visible={snackbar != ""}
          value={snackbar}
          setValue={setSnackbar}
        />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    </PaperProvider>
  );
}
