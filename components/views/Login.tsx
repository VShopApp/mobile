import React, { PropsWithChildren, useEffect, useState } from "react";
import { View } from "react-native";
import {
  Button,
  TextInput,
  Checkbox,
  ActivityIndicator,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { login, submitMfaCode } from "../../utils/ValorantAPI";
import * as SecureStore from "expo-secure-store";

interface props {
  user: user | undefined;
  setUser: Function;
  setSnackbar: Function;
}
export default function Login(props: PropsWithChildren<props>) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("eu");
  const [exisitingUser, setExistingUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savePw, setSavePw] = useState(true);
  const [dropdownShown, setDropdownShown] = useState(false);
  const [MFAInputEnabled, setMFAInputEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState("");

  const handleBtnLogin = async () => {
    setLoading(true);
    let user = await login(username, password, region);
    if (user.error) {
      setLoading(false);
      props.setSnackbar(user.error);
    } else if (user.mfaRequired) {
      setMFAInputEnabled(true);
      props.setSnackbar(
        "Please enter the MFA code that has been sent to your email."
      );
    } else {
      props.setUser(user);
      if (savePw) {
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify({ username, password, region })
        );
      } else {
        await SecureStore.deleteItemAsync("user");
      }
    }
  };

  const handleMfaCode = async () => {
    setLoading(true);
    let user = await submitMfaCode(username, mfaCode, region);

    if (user.error) {
      setLoading(false);
      props.setSnackbar(user.error);
    } else {
      props.setUser(user);
      if (savePw) {
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify({ username, password, region })
        );
      } else {
        await SecureStore.deleteItemAsync("user");
      }
    }
  };

  const handleDirectLogin = async ({ username, password, region }: any) => {
    let user = await login(username, password, region);
    if (user.error) {
      setLoading(false);
      props.setSnackbar(user.error);
      setExistingUser(false);
    } else if (user.mfaRequired) {
      setMFAInputEnabled(true);
      props.setSnackbar(
        "Please enter the MFA code that has been sent to your email."
      );
    } else {
      props.setUser(user);
    }
  };

  useEffect(() => {
    const restoreCredentials = async () => {
      let user = await SecureStore.getItemAsync("user");
      let userObj = user ? JSON.parse(user) : null;
      if (userObj) {
        setExistingUser(true);

        await handleDirectLogin(userObj);
      } else {
        setLoading(false);
      }
    };
    restoreCredentials();
  }, []);

  if (MFAInputEnabled) {
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
            setMfaCode(text);
          }}
          value={mfaCode}
          label="MFA Code"
          autoCompleteType="password"
        />
        <Button onPress={handleMfaCode} mode="contained">
          Submit
        </Button>
      </View>
    );
  }

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator animating={true} color={"#fa4454"} size="large" />
      </View>
    );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!exisitingUser && (
        <>
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
          <Button onPress={handleBtnLogin} disabled={loading} mode="contained">
            Log In
          </Button>
        </>
      )}
    </View>
  );
}
