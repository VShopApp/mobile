import React, { PropsWithChildren, useEffect, useState } from "react";
import { View } from "react-native";
import {
  Button,
  TextInput,
  Checkbox,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { login, setSRegion, submitMfaCode } from "../utils/ValorantAPI";
import * as SecureStore from "expo-secure-store";

interface props {
  setLoggedIn: Function;
  setSnackbar: Function;
}
export default function Login(props: PropsWithChildren<props>) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("eu");
  const [loading, setLoading] = useState(false);
  const [savePw, setSavePw] = useState(true);
  const [dropdownShown, setDropdownShown] = useState(false);
  const [MFAInputEnabled, setMFAInputEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState("");

  const handleBtnLogin = async () => {
    setLoading(true);
    let response = await login(username, password);

    if (response?.error) {
      setLoading(false);
      props.setSnackbar(response.error);
    } else if (response?.mfaRequired) {
      setLoading(false);
      setMFAInputEnabled(true);
      props.setSnackbar(
        `The MFA code has been sent to your email (${response.mfaEmail}).`
      );
    } else {
      if (savePw) {
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify({
            username,
            password,
            region,
            accessToken: response?.accessToken,
            entitlementsToken: response?.entitlementsToken,
          })
        );
      } else {
        await SecureStore.deleteItemAsync("user");
      }
      setSRegion(region);
      props.setLoggedIn(true);
    }
  };

  const handleMfaCode = async () => {
    setLoading(true);
    let response = await submitMfaCode(mfaCode);

    if (response.error) {
      setLoading(false);
      props.setSnackbar(response.error);
    } else {
      if (savePw) {
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify({
            username,
            password,
            region,
            accessToken: response.accessToken,
            entitlementsToken: response.entitlementsToken,
          })
        );
      } else {
        await SecureStore.deleteItemAsync("user");
      }
      setSRegion(region);
      props.setLoggedIn(true);
    }
  };

  const handleDirectLogin = async ({
    username,
    password,
    accessToken,
    entitlementsToken,
    region,
  }: any) => {
    let response = await login(
      username,
      password,
      accessToken,
      entitlementsToken
    );
    setSRegion(region);
    if (response?.error) {
      setLoading(false);
      props.setSnackbar(response.error);
    } else if (response?.mfaRequired) {
      setLoading(false);
      setMFAInputEnabled(true);
      props.setSnackbar(
        `The MFA code has been sent to your email (${response.mfaEmail}).`
      );
    } else {
      props.setLoggedIn(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    const restoreCredentials = async () => {
      let user = await SecureStore.getItemAsync("user");
      let userObj = user ? JSON.parse(user) : null;
      if (userObj) {
        setUsername(userObj.username); // Required because if 2fa is required, the username is accessed in handleMfaCode function
        setPassword(userObj.password);
        setRegion(userObj.region);

        await handleDirectLogin(userObj);
      } else {
        setLoading(false);
      }
    };
    restoreCredentials();
  }, []);

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
        }}
      >
        <ActivityIndicator animating={true} color={"#fa4454"} size="large" />
      </View>
    );

  if (MFAInputEnabled) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
        }}
      >
        <TextInput
          style={{ width: 250, height: 50, marginBottom: 10 }}
          onChangeText={(text) => {
            setMfaCode(text);
          }}
          value={mfaCode}
          label="MFA Code"
          textContentType="oneTimeCode"
          keyboardType="numeric"
          autoComplete={false}
        />
        <Button onPress={handleMfaCode} mode="contained">
          Submit
        </Button>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
      }}
    >
      <>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Welcome</Text>
        <Text style={{ fontSize: 14, marginBottom: 18 }}>
          Please log in to continue
        </Text>
        <TextInput
          style={{ width: 250, height: 50, marginBottom: 8 }}
          onChangeText={(text) => {
            setUsername(text);
          }}
          value={username}
          label="Username"
          textContentType="username"
          autoCapitalize="none"
          autoComplete={false}
        />
        <TextInput
          label="Password"
          onChangeText={(text) => {
            setPassword(text);
          }}
          value={password}
          style={{ width: 250, height: 50, marginBottom: 8 }}
          secureTextEntry={true}
          textContentType="password"
          autoCapitalize="none"
          autoComplete={false}
        />
        <View style={{ width: 250, marginBottom: 4 }}>
          <DropDown
            label={"Region"}
            mode={"outlined"}
            visible={dropdownShown}
            showDropDown={() => setDropdownShown(true)}
            onDismiss={() => setDropdownShown(false)}
            value={region}
            setValue={setRegion}
            list={[
              { label: "Europe", value: "eu" },
              { label: "North America", value: "na" },
              { label: "Asia-Pacific", value: "ap" },
              { label: "Korea", value: "kr" },
            ]}
          />
        </View>
        <Checkbox.Item
          label="Save credentials"
          status={savePw ? "checked" : "unchecked"}
          onPress={() => {
            setSavePw(!savePw);
          }}
        />
        <Button
          onPress={handleBtnLogin}
          disabled={loading}
          mode="contained"
          style={{ marginTop: 4 }}
        >
          Log In
        </Button>
      </>
    </View>
  );
}
