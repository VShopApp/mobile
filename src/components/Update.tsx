import React, { PropsWithChildren, useState } from "react";
import { Dialog as PaperDialog, Portal, Paragraph } from "react-native-paper";
import * as Updates from "expo-updates";

interface props {}
export default function Update(props: PropsWithChildren<props>) {
  const [visible, setVisible] = useState(false);

  Updates.addListener(async (event) => {
    // Reload app once update is downloaded
    if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
      setVisible(true);
      await Updates.reloadAsync();
    }
  });

  return (
    <>
      <Portal>
        <PaperDialog visible={visible} dismissable={false}>
          <PaperDialog.Content>
            <Paragraph>
              An update has been downloaded, relaunching app...
            </Paragraph>
          </PaperDialog.Content>
        </PaperDialog>
      </Portal>
    </>
  );
}
