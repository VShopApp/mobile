import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface props {
  timestamp: number;
}
export default function Countdown({ timestamp }: props) {
  const [diff, setDiff] = React.useState(timestamp - new Date().getTime());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDiff(timestamp - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const days = Math.floor(diff / 1000 / 60 / 60 / 24);
  const hours = Math.floor(
    (diff - days * 1000 * 60 * 60 * 24) / 1000 / 60 / 60,
  );
  const minutes = Math.floor(
    (diff - days * 1000 * 60 * 60 * 24 - hours * 1000 * 60 * 60) / 1000 / 60,
  );
  const seconds = Math.floor(
    (diff -
      days * 1000 * 60 * 60 * 24 -
      hours * 1000 * 60 * 60 -
      minutes * 1000 * 60) /
      1000,
  );

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}>
      <Icon name="timer" size={15} color="white" style={{ marginRight: 3 }} />
      <Text
        style={{
          fontSize: 13,
        }}>
        {days > 0
          ? `${days}:${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          : `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
      </Text>
    </View>
  );
}
