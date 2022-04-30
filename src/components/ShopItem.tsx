import React, { PropsWithChildren, useState } from "react";
import { Card, Title, Paragraph, Button } from "react-native-paper";
import CurrencyIcon from "./CurrencyIcon";
import VideoPopup from "./VideoPopup";

interface props {
  item: shopItem;
}
export default function ShopItem(props: PropsWithChildren<props>) {
  const [videoShown, setVideoShown] = useState(false);
  const showVideo = () => {
    setVideoShown(true);
  };

  return (
    <>
      <Card style={{ margin: 5, backgroundColor: "#1E1E1E" }}>
        <Card.Content>
          <Title>{props.item.displayName}</Title>
          <Paragraph>
            {props.item.price} <CurrencyIcon icon="vp" />
          </Paragraph>
        </Card.Content>
        <Card.Cover
          resizeMode="contain"
          style={{ backgroundColor: "#1E1E1E" }}
          source={{ uri: props.item.displayIcon }}
        />
        <Card.Actions>
          <Button
            onPress={showVideo}
            disabled={props.item.streamedVideo == null}
          >
            Video
          </Button>
        </Card.Actions>
      </Card>
      <VideoPopup
        videoUri={props.item.streamedVideo}
        visible={videoShown}
        setVisible={setVideoShown}
      />
    </>
  );
}
