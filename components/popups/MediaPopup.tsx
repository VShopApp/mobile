import { Portal, Modal, Button, Text, useTheme } from "react-native-paper";
import { View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { create } from "zustand";
import { useEffect, useState } from "react";
import { Image } from "expo-image";

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

function MediaPopup() {
  const { uris, text, selectedIndex, setSelectedIndex, hideMediaPopup } =
    useMediaPopupStore();
  const [imageLoading, setImageLoading] = useState(false);
  const { colors } = useTheme();

  const isImage = uris[selectedIndex]
    ? uris[selectedIndex].endsWith(".png") ||
      uris[selectedIndex].endsWith(".jpg")
    : false;
  const player = useVideoPlayer(
    !isImage ? uris[selectedIndex] : null,
    (player) => {
      player.loop = true;
      player.muted = false;
      player.play();
    }
  );

  useEffect(() => {
    console.log(player.status);
  }, [player.status]);

  return (
    <Portal>
      <Modal
        visible={uris.length > 0}
        onDismiss={() => {
          hideMediaPopup();
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View style={{ padding: 10 }}>
            {uris.length > 0 &&
              (isImage ? (
                <Image
                  style={{
                    aspectRatio: 16 / 9,
                    width: "100%",
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    backgroundColor: "#000",
                  }}
                  contentFit="contain"
                  source={{ uri: uris[selectedIndex] }}
                  onLoadStart={() => setImageLoading(true)}
                  onLoad={() => setImageLoading(false)}
                />
              ) : (
                <VideoView
                  player={player}
                  allowsFullscreen
                  style={{
                    aspectRatio: 16 / 9,
                    width: "100%",
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                  }}
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
              }}
            >
              <Text
                style={{
                  textTransform: "uppercase",
                  color: colors.primary,
                  fontSize: 15,
                  marginRight: 5,
                }}
              >
                {text}
              </Text>
              {uris.map((uri, i) => (
                <View
                  style={{
                    borderBottomWidth: i === selectedIndex ? 1 : 0,
                    borderBottomColor: colors.primary,
                  }}
                  key={i}
                >
                  <Button
                    onPress={() => setSelectedIndex(i)}
                    loading={
                      i === selectedIndex &&
                      (imageLoading || player.status === "loading")
                    }
                  >
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

export default MediaPopup;
