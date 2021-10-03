import React, { PropsWithChildren } from "react";
import { Snackbar } from "react-native-paper";

interface props {
  visible: boolean;
  value: string;
  setValue: Function;
}
export default function SnackBar(props: PropsWithChildren<props>) {
  return (
    <>
      <Snackbar
        visible={props.visible}
        onDismiss={() => props.setValue("")}
        action={{
          label: "Close",
          onPress: () => {
            props.setValue("");
          },
        }}
      >
        {props.value}
      </Snackbar>
    </>
  );
}
