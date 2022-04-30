import React, { PropsWithChildren, useState } from "react";
import { Linking } from "react-native";
import {
  Dialog as PaperDialog,
  Portal,
  Paragraph,
  Button,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";

interface props {}
export default function Info(props: PropsWithChildren<props>) {
  const infoVersion = "1";
  const [open, setOpen] = useState(false);

  const alreadyShownCheck = async () => {
    const alreadyShown = await SecureStore.getItemAsync("infoShown");
    if (alreadyShown != infoVersion) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleBtnClose = async () => {
    setOpen(false);
    await SecureStore.setItemAsync("infoShown", infoVersion);
  };

  alreadyShownCheck();
  return (
    <>
      <Portal>
        <PaperDialog visible={open}>
          <PaperDialog.Title>Info</PaperDialog.Title>
          <PaperDialog.Content>
            <Paragraph>
              VShop is now fully working again! I'm really sorry for the
              problems we had. We now have a new Discord Server, feel free to
              join.
            </Paragraph>
          </PaperDialog.Content>
          <PaperDialog.Actions>
            <Button onPress={handleBtnClose}>Close</Button>
            <Button
              onPress={() => {
                Linking.openURL("https://vshop.one/discord");
              }}
            >
              Discord Server
            </Button>
          </PaperDialog.Actions>
        </PaperDialog>
      </Portal>
    </>
  );
}
