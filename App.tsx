import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import Login from "./components/Login";
import { Provider as PaperProvider } from "react-native-paper";
import Shop from "./components/Shop";
import AppBar from "./components/AppBar";
import Settings from "./components/Settings";

export default function App() {
  const [user, setUser] = useState<user>();
  const [view, setView] = useState(0);

  return (
    <PaperProvider>
      <SafeAreaView>
        <AppBar setView={setView} />
        {!user || user.loading ? (
          <Login user={user} setUser={setUser} />
        ) : (
          <>
            <Shop user={user} visible={view == 0} />
            <Settings user={user} setUser={setUser} visible={view == 1} />
          </>
        )}
        <StatusBar barStyle="default" />
      </SafeAreaView>
    </PaperProvider>
  );
}
