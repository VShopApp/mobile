import React, { PropsWithChildren, useEffect, useState } from "react";
import { Portal, Modal } from "react-native-paper";
import { ScrollView, View } from "react-native";

interface props {
  visible: boolean;
  setVisible: Function;
}
export default function Changelog(props: PropsWithChildren<props>) {
  const [changelog, setChangelog] = useState("");

  useEffect(() => {
    setChangelog("# test");
  }, []);

  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={() => {
          props.setVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={{ height: "100%" }}
          >
            {changelog}
          </ScrollView>
        </View>
      </Modal>
    </Portal>
  );
}
