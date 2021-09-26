import React, { PropsWithChildren, useState } from "react";
import { Card, Title, Paragraph, Button } from "react-native-paper";
import VideoPopup from "./VideoPopup";

interface props {
  item: singleItem;
}
export default function Item(props: PropsWithChildren<props>) {
  const [videoShown, setVideoShown] = useState(false);
  const showVideo = () => {
    setVideoShown(true);
  };

  return (
    <>
      <Card style={{ height: 315, width: 400 }}>
        <Card.Content>
          <Title>{props.item.displayName}</Title>
          <Paragraph>{props.item.price} Creds</Paragraph>
        </Card.Content>
        <Card.Cover
          resizeMode="contain"
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
