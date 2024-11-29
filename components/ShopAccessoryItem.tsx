import { Card, Title, Paragraph, useTheme } from "react-native-paper";
import CurrencyIcon from "./CurrencyIcon";
import { useFeatureStore } from "~/hooks/useFeatureStore";
import { getDisplayIcon } from "~/utils/misc";

interface props {
  item: AccessoryShopItem;
}
export default function ShopAccessoryItem(
  props: React.PropsWithChildren<props>
) {
  const { screenshotModeEnabled } = useFeatureStore();
  const { colors } = useTheme();

  return (
    <>
      <Card
        style={{
          margin: 5,
          backgroundColor: colors.surface,
        }}
      >
        <Card.Content>
          <Title>{props.item.displayName}</Title>
          <Paragraph>
            {props.item.price} <CurrencyIcon icon="kc" />
          </Paragraph>
        </Card.Content>
        <Card.Cover
          resizeMode="contain"
          style={{
            backgroundColor: colors.surface,
            padding: 10,
          }}
          source={getDisplayIcon(props.item, screenshotModeEnabled)}
        />
      </Card>
    </>
  );
}
