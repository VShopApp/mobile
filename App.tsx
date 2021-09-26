import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import Login from "./components/Login";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Shop from "./components/Shop";
import AppBar from "./components/AppBar";
import Settings from "./components/Settings";
import SnackBar from "./components/SnackBar";

export default function App() {
  const [user, setUser] = useState<user>();
  const [view, setView] = useState(0);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarTxt, setSnackbarTxt] = useState("");

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#fa4454",
      accent: "#042e27",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ width: "100%", height: "100%" }}>
        <AppBar setView={setView} showActions={user != null && !user.loading} />
        {!user || user.loading ? (
          <Login
            user={user}
            setUser={setUser}
            setSnackbarTxt={setSnackbarTxt}
            setSnackbarVisible={setSnackbarVisible}
          />
        ) : (
          <>
            <Shop user={user} visible={view == 0} />
            <Settings user={user} setUser={setUser} visible={view == 1} />
          </>
        )}
        <SnackBar
          visible={snackbarVisible}
          setVisible={setSnackbarVisible}
          txt={snackbarTxt}
        />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    </PaperProvider>
  );
}
