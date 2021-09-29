import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import Login from "./components/views/Login";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import AppBar from "./components/AppBar";
import SnackBar from "./components/SnackBar";
import Navigation from "./components/Navigation";

export default function App() {
  const [user, setUser] = useState<user>();

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
        <AppBar />
        {!user || user.loading ? (
          <Login
            user={user}
            setUser={setUser}
            setSnackbarTxt={setSnackbarTxt}
            setSnackbarVisible={setSnackbarVisible}
          />
        ) : (
          <>
            <Navigation user={user} setUser={setUser} />
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
