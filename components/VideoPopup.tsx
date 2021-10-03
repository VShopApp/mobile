import React, { PropsWithChildren } from "react";
import { Video as ExpoVideo } from "expo-av";
import { Portal, Modal } from "react-native-paper";
import { View } from "react-native";

interface props {
  videoUri: string;
  visible: boolean;
  setVisible: Function;
}
export default function VideoPopup(props: PropsWithChildren<props>) {
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
          <ExpoVideo
            style={{ width: 320, height: 180, borderRadius: 5 }}
            source={{
              uri: props.videoUri,
            }}
            resizeMode="contain"
            isLooping
            shouldPlay
          />
        </View>
      </Modal>
    </Portal>
  );
}
