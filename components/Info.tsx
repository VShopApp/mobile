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
  const [open, setOpen] = useState(true);

  return (
    <>
      <Portal>
        <PaperDialog visible={open}>
          <PaperDialog.Content>
            <Paragraph>
              VShop is now fully working again! I'm really sorry for the
              problems we had. We now have a new Discord Server, feel free to
              join.
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
