import { ImageBackground, View } from "react-native";
import { Text } from "react-native-paper";
import { sBundle } from "../utils/ValorantAPI";
import CurrencyIcon from "./CurrencyIcon";

export default function Bundle() {
  return (
    <ImageBackground
      style={{
        marginBottom: 5,
        flex: 1,
        justifyContent: "center",
      }}
      source={{ uri: sBundle?.displayIcon }}
      resizeMode="cover"
    >
      <View
        style={{
          backgroundColor: "#000000a0",
          padding: 50,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 30,
          }}
        >
          {sBundle?.displayName}
        </Text>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 15,
          }}
        >
          {sBundle?.price} <CurrencyIcon icon="vp" />
        </Text>
      </View>
    </ImageBackground>
  );
}
