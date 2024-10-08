import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Modal,
  Paragraph,
  Portal,
  Text,
  TextInput,
  Title,
} from "react-native-paper";
import { Linking, ToastAndroid, View } from "react-native";
import { create } from "zustand";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { checkDonator, getCurrencies } from "../../utils/VShopAPI";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { useUserStore } from "../../stores/user";
import TextInputMask from "react-native-text-input-mask";
import { getCurrencies as getUserCurrencies } from "react-native-localize";
import { useFeatureStore } from "../../stores/features";
import { API_URL } from "@env";

interface IStore {
  visible: boolean;
  showDonatePopup: () => void;
  hideDonatePopup: () => void;
}
export const useDonatePopupStore = create<IStore>((set) => ({
  visible: false,
  showDonatePopup: () => set({ visible: true }),
  hideDonatePopup: () => set({ visible: false }),
}));

export default function DonatePopup() {
  const { t } = useTranslation();
  const { visible, hideDonatePopup } = useDonatePopupStore();
  const [currency, setCurrency] = React.useState<ICurrency>();
  const [amount, setAmount] = React.useState("");
  const validAmount = currency
    ? Number.parseFloat(amount) >= currency.minimum
    : false;
  const { user } = useUserStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { enableDonator } = useFeatureStore();

  const initializePaymentSheet = async () => {
    const response = await axios.request({
      url: `${API_URL}/stripe/payment-sheet`,
      method: "POST",
      data: {
        amount: Number.parseFloat(amount),
        riotId: user.id,
        currencyCode: currency?.code.toLowerCase(),
      },
      validateStatus: () => true,
    });
    if (response.status === 200) {
      const { paymentIntent } = response.data;

      const { error } = await initPaymentSheet({
        merchantDisplayName: "VShop",
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
      });
      if (!error) return true;
      return false;
    } else {
      ToastAndroid.show(response.data.error, ToastAndroid.LONG);
    }
    return false;
  };

  const openPaymentSheet = async () => {
    const ready = await initializePaymentSheet();
    if (ready) {
      const { error } = await presentPaymentSheet();

      if (error) {
        ToastAndroid.show(t("purchase.error"), ToastAndroid.LONG);
        console.log(error);
      } else {
        ToastAndroid.show(t("purchase.success"), ToastAndroid.LONG);
        hideDonatePopup();
        setTimeout(async () => {
          const isDonator = await checkDonator(user.id);
          if (isDonator) enableDonator();
        }, 2500);
      }
    }
  };

  React.useEffect(() => {
    getCurrencies().then((currencies) => {
      const userCurrency = currencies.find(
        (_currency) =>
          _currency.code.toLowerCase() ==
          getUserCurrencies()[0].toLocaleLowerCase(),
      );
      if (userCurrency) setCurrency(userCurrency);
      else setCurrency(currencies[0]);
    });
  }, []);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideDonatePopup}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}>
          <Card style={{ width: "80%" }}>
            <Card.Cover
              source={require("../../../assets/notification.png")}
              resizeMode="center"
              resizeMethod="scale"
              style={{ height: 125 }}
            />
            <Card.Content style={{ marginTop: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <Icon
                  name="hand-coin"
                  size={25}
                  color="white"
                  style={{ marginRight: 5 }}
                />
                <Title style={{ color: "#fff" }}>{t("donate")}</Title>
              </View>
              <Paragraph>{t("donate_msg")}</Paragraph>
              <TextInput
                value={amount}
                onChangeText={(value) => setAmount(value)}
                left={
                  <TextInput.Affix
                    text={currency?.symbol}
                    textStyle={{ paddingRight: 3 }}
                  />
                }
                label={t("amount")}
                keyboardType="numeric"
                mode="flat"
                render={(props) => (
                  <TextInputMask
                    {...(props as any)}
                    mask={currency?.zeroDecimal ? "[9…]" : "[099].[99]"}
                  />
                )}
                style={{ marginVertical: 5 }}
              />
              {currency && !validAmount && (
                <Text style={{ color: "red" }}>
                  {t("invalid_amount", {
                    amount: `${currency.symbol}${currency.minimum}`,
                  })}
                </Text>
              )}
              <Button
                mode={"text"}
                onPress={() =>
                  Linking.openURL(
                    `https://vshop.one/restore-purchase?riotid=${user.id}`,
                  )
                }
                labelStyle={{ fontSize: 12 }}>
                {t("purchase.restore")}
              </Button>
            </Card.Content>
            <Card.Actions style={{ justifyContent: "flex-end" }}>
              <Button onPress={hideDonatePopup}>{t("no")}</Button>
              <Button
                onPress={openPaymentSheet}
                disabled={!currency || !validAmount || amount.length === 0}>
                {t("donate")}
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </Modal>
    </Portal>
  );
}
