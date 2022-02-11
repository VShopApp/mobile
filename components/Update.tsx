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
        <PaperDialog visible={visible} onDismiss={reloadApp}>
          <PaperDialog.Title>Update available</PaperDialog.Title>
          <PaperDialog.Content>
            <Paragraph>
              A new update has been downloaded. The app needs to be restarted
              for the changes to take effect.
            </Paragraph>
          </PaperDialog.Content>
          <PaperDialog.Actions>
            <Button onPress={reloadApp}>OKAY</Button>
          </PaperDialog.Actions>
        </PaperDialog>
      </Portal>
    </>
  );
}
