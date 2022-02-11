import React, { PropsWithChildren, useState } from "react";
import { Card, Title, Paragraph, Button, Text } from "react-native-paper";
import VideoPopup from "./VideoPopup";
import VPIcon from "./VPIcon";

interface props {
  item: singleNightMarketItem;
}
export default function NightMarketItem(props: PropsWithChildren<props>) {
  const [videoShown, setVideoShown] = useState(false);
  const showVideo = () => {
    setVideoShown(true);
  };

  return (
    <>
      <Card style={{ margin: 5 }}>
        <Card.Content>
          <Title>{props.item.displayName}</Title>
          <Paragraph>
            <Text
              style={{
                textDecorationLine: "line-through",
                textDecorationStyle: "solid",
                fontSize: 12,
              }}
            >
              {props.item.price}
            </Text>{" "}
            {props.item.discountPrice} <VPIcon color="black" /> (
            <Text
              style={{
                color: "green",
              }}
            >
              -{props.item.discountPercent}%
            </Text>
            )
          </Paragraph>
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
