import React, { PropsWithChildren } from "react";
import { Image } from "react-native";

interface props {
  color: "white" | "black";
}
export default function VPIcon(props: PropsWithChildren<props>) {
  return (
    <>
      <Image
        style={{ width: 15, height: 15 }}
        source={
          props.color == "white"
            ? require("../assets/vp-white.png")
            : require("../assets/vp-black.png")
        }
      />
    </>
  );
}
