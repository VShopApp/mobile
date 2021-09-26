import React, { PropsWithChildren } from "react";
import { Snackbar } from "react-native-paper";

interface props {
  visible: boolean;
  setVisible: Function;
  txt: string;
}
export default function SnackBar(props: PropsWithChildren<props>) {
  return (
    <>
      <Snackbar
        visible={props.visible}
        onDismiss={() => props.setVisible(false)}
        action={{
          label: "Close",
          onPress: () => {
            props.setVisible(false);
          },
        }}
      >
        {props.txt}
      </Snackbar>
    </>
  );
}
