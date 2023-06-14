import React from "react";
import { Portal, Modal, Button, Text } from "react-native-paper";
import { Image, View } from "react-native";
import Video from "react-native-video";
import { CombinedDarkTheme } from "../../App";
import { create } from "zustand";

interface IStore {
  uris: string[];
  text: string;
  selectedIndex: number;
  showMediaPopup: (uris: string[], text: string) => void;
  hideMediaPopup: () => void;
  setSelectedIndex: (index: number) => void;
}
export const useMediaPopupStore = create<IStore>((set) => ({
  uris: [],
  text: "",
  selectedIndex: 0,
  showMediaPopup: (uris: string[], text: string) =>
    set({ uris, text, selectedIndex: 0 }),
  hideMediaPopup: () => set({ uris: [], text: "" }),
  setSelectedIndex: (index: number) => set({ selectedIndex: index }),
}));

export default function MediaPopup() {
  const { uris, text, selectedIndex, setSelectedIndex, hideMediaPopup } =
    useMediaPopupStore();
  const [loading, setLoading] = React.useState(true);

  return (
    <Portal>
      <Modal
        visible={uris.length > 0}
        onDismiss={() => {
          hideMediaPopup();
        }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}>
          <View style={{ padding: 10 }}>
            {uris.length > 0 &&
              (uris[selectedIndex].endsWith(".png") ||
              uris[selectedIndex].endsWith(".jpg") ? (
                <Image
                  style={{
                    aspectRatio: 16 / 9,
                    width: "100%",
                    // Produces weird artifacts: https://github.com/facebook/react-native/issues/35815
                    // borderTopLeftRadius: 5,
                    // borderTopRightRadius: 5,
                    backgroundColor: "#000",
                  }}
                  resizeMode="contain"
                  source={{ uri: uris[selectedIndex] }}
                  onLoadStart={() => setLoading(true)}
                  onLoad={() => setLoading(false)}
                />
              ) : (
                <Video
                  source={{ uri: uris[selectedIndex] }}
                  style={{
                    aspectRatio: 16 / 9,
                    width: "100%",
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                  }}
                  muted={false}
                  repeat={true}
                  paused={false}
                  onLoadStart={() => setLoading(true)}
                  onLoad={() => setLoading(false)}
                />
              ))}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000",
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
              }}>
              <Text
                style={{
                  textTransform: "uppercase",
                  color: CombinedDarkTheme.colors.primary,
                  fontSize: 15,
                  marginRight: 5,
                }}>
                {text}
              </Text>
              {uris.map((uri, i) => (
                <View
                  style={{
                    borderBottomWidth: i === selectedIndex ? 1 : 0,
                    borderBottomColor: CombinedDarkTheme.colors.primary,
                  }}
                  key={i}>
                  <Button
                    onPress={() => setSelectedIndex(i)}
                    loading={i === selectedIndex && loading}>
                    {i + 1}
                  </Button>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
