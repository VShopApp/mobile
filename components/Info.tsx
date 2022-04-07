import React, { PropsWithChildren, useState } from "react";
import { Linking } from "react-native";
import {
  Dialog as PaperDialog,
  Portal,
  Paragraph,
  Button,
} from "react-native-paper";

interface props {}
export default function Info(props: PropsWithChildren<props>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Portal>
        <PaperDialog visible={open} dismissable={true}>
          <PaperDialog.Content>
            <Paragraph>
              VShop is currently up and running again, but don't get your hopes
              up, because it might break again in the future. To get the latest
              infos join our Discord Server.
            </Paragraph>
          </PaperDialog.Content>
          <PaperDialog.Actions>
            <Button
              onPress={() => {
                setOpen(false);
              }}
            >
              Close
            </Button>
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
