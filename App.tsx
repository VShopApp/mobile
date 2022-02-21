import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import Login from "./views/Login";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import AppBar from "./components/AppBar";
import SnackBar from "./components/SnackBar";
import Navigation from "./components/Navigation";
import Update from "./components/Update";

export default function App() {
  const [user, setUser] = useState<user>();
  const [snackbar, setSnackbar] = useState("");

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#fa4454",
      accent: "#fa4454",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ width: "100%", height: "100%" }}>
        <Update />
        <AppBar />
        {!user || user.loading ? (
          <Login user={user} setUser={setUser} setSnackbar={setSnackbar} />
        ) : (
          <Navigation user={user} setUser={setUser} />
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
