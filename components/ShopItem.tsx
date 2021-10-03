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
      <Card style={{ margin: 5 }}>
        <Card.Content>
          <Title>{props.item.displayName}</Title>
          <Paragraph>{props.item.price} VP</Paragraph>
        </Card.Content>
        <Card.Cover
          resizeMode="contain"
          style={{ backgroundColor: "#fff" }}
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
