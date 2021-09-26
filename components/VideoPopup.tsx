import React, { PropsWithChildren } from "react";
import { Video as ExpoVideo } from "expo-av";
import Dialog, { DialogContent } from "react-native-popup-dialog";

interface props {
  videoUri: string;
  visible: boolean;
  setVisible: Function;
}
export default function Video(props: PropsWithChildren<props>) {
  return (
    <Dialog
      visible={props.visible}
      onTouchOutside={() => {
        props.setVisible(false);
      }}
    >
      <DialogContent style={{ width: 320, height: 180 }}>
        <ExpoVideo
          style={{ position: "absolute", width: 320, height: 180 }}
          source={{
            uri: props.videoUri,
          }}
          resizeMode="contain"
          isLooping
          shouldPlay
        />
      </DialogContent>
    </Dialog>
  );
}
