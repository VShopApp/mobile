import { useTranslation } from "react-i18next";
import { Card, Title, Paragraph, Button, useTheme } from "react-native-paper";
import CurrencyIcon from "./CurrencyIcon";
import { useMediaPopupStore } from "./popups/MediaPopup";
import { useWishlistStore } from "~/hooks/useWishlistStore";
import { useFeatureStore } from "~/hooks/useFeatureStore";
import { getDisplayIcon, getDisplayIcon2 } from "~/utils/misc";

interface props {
  item: IShopItem2;
}
export default function ShopAccessoryItem(props: React.PropsWithChildren<props>) {
  const { t } = useTranslation();
  const { showMediaPopup } = useMediaPopupStore();
  const { skinIds } = useWishlistStore();
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
          <Title>
            {props.item.displayName}
          </Title>
          <Paragraph>
            {props.item.price} <CurrencyIcon icon="kc" />
          </Paragraph>
        </Card.Content>
          { props.item.assetPath !== "" ? (
        <Card.Cover
          resizeMode="contain"
          style={{
            backgroundColor: colors.surface,
            padding: 10,
          }}
          source={getDisplayIcon2(props.item, screenshotModeEnabled)}
        />): <></>}
      </Card>
    </>
  );
}
