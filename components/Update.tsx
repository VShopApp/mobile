import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  Dialog as PaperDialog,
  Portal,
  Paragraph,
  Button,
} from "react-native-paper";
import * as Updates from "expo-updates";

interface props {}
export default function Update(props: PropsWithChildren<props>) {
  const [visible, setVisible] = useState(false);

  const dismissModal = () => {
    setVisible(false);
  };

  const reloadApp = async () => {
    await Updates.reloadAsync();
  };

  Updates.addListener(async (event) => {
    // Reload app once update is downloaded
    if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
      setVisible(true);
    }
  });

  return (
    <>
      <Portal>
        <PaperDialog visible={visible} onDismiss={dismissModal}>
          <PaperDialog.Title>Update available</PaperDialog.Title>
          <PaperDialog.Content>
            <Paragraph>
              A new update has been downloaded. Do you want to restart to apply
              the update?
            </Paragraph>
          </PaperDialog.Content>
          <PaperDialog.Actions>
            <Button onPress={reloadApp}>Yes</Button>
            <Button onPress={dismissModal}>No</Button>
          </PaperDialog.Actions>
        </PaperDialog>
      </Portal>
    </>
  );
}
