import React, { PropsWithChildren, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, TextInput, Checkbox } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { login } from "../../utils/ValorantAPI";
import * as SecureStore from "expo-secure-store";

interface props {
  user: user | undefined;
  setUser: Function;
  setSnackbarVisible: Function;
  setSnackbarTxt: Function;
}
export default function Login(props: PropsWithChildren<props>) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("eu");
  const [savePw, setSavePw] = useState(true);
  const [dropdownShown, setDropdownShown] = useState(false);

  const handleLogin = async () => {
    props.setUser({ loading: true });
    let user = await login(username, password, region);
    if (user.error) {
      props.setUser(null);
      props.setSnackbarTxt(user.error);
      props.setSnackbarVisible(true);
    } else {
      props.setUser(user);
      if (savePw) {
        await SecureStore.setItemAsync("username", username);
        await SecureStore.setItemAsync("pw", password);
      } else {
        await SecureStore.deleteItemAsync("username");
        await SecureStore.deleteItemAsync("pw");
      }
    }
  };

  useEffect(() => {
    // Restore username & password
    SecureStore.getItemAsync("username").then((storedUsername) => {
      SecureStore.getItemAsync("pw").then((storedPw) => {
        if (storedUsername && storedPw) {
          setUsername(storedUsername);
          setPassword(storedPw);
        }
      });
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        style={{ width: 250, height: 50, marginBottom: 10 }}
        onChangeText={(text) => {
          setUsername(text);
        }}
        value={username}
        label="Username"
        autoCompleteType="username"
      />
      <TextInput
        label="Password"
        onChangeText={(text) => {
          setPassword(text);
        }}
        value={password}
        style={{ width: 250, height: 50, marginBottom: 10 }}
        autoCompleteType="password"
        secureTextEntry={true}
      />
      <Checkbox.Item
        label="Save credentials"
        status={savePw ? "checked" : "unchecked"}
        onPress={() => {
          setSavePw(!savePw);
        }}
      />
      <View style={{ width: 100, marginBottom: 15 }}>
        <DropDown
          label={"Region"}
          mode={"outlined"}
          visible={dropdownShown}
          showDropDown={() => setDropdownShown(true)}
          onDismiss={() => setDropdownShown(false)}
          value={region}
          setValue={setRegion}
          list={[
            { label: "EU", value: "eu" },
            { label: "NA", value: "na" },
            { label: "AP", value: "ap" },
            { label: "KR", value: "kr" },
          ]}
        />
      </View>
      <Button
        onPress={handleLogin}
        mode="contained"
        loading={props.user?.loading}
      >
        Log In
      </Button>
    </View>
  );
}
