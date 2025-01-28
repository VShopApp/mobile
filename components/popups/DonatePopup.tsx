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
  useTheme,
} from "react-native-paper";
import { Linking, ToastAndroid, View } from "react-native";
import { create } from "zustand";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  checkDonator,
  generatePaymentSheet,
  getCurrencies,
} from "~/utils/vshop-api";
import { PaymentSheet, useStripe } from "@stripe/stripe-react-native";
import { useUserStore } from "~/hooks/useUserStore";
import { useFeatureStore } from "~/hooks/useFeatureStore";
import { useEffect, useState } from "react";
import { getLocales } from "expo-localization";

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
  const [currency, setCurrency] = useState<ICurrency>();
  const [amount, setAmount] = useState("");
  const parsedAmount = Number.parseFloat(amount.replace(",", "."));
  const isValidAmount = /^[0-9]+([,.][0-9]{1,2})?$/.test(amount);
  const { user } = useUserStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { enableDonator } = useFeatureStore();
  const { colors } = useTheme();

  const initializePaymentSheet = async () => {
    const res = await generatePaymentSheet({
      amount: parsedAmount,
      riotId: user.id,
      currencyCode: currency?.code.toLowerCase() ?? "",
    });
    if (res.status === 200) {
      const { paymentIntent } = res.data;

      const { error } = await initPaymentSheet({
        merchantDisplayName: "VShop",
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        billingDetailsCollectionConfiguration: {
          name: PaymentSheet.CollectionMode.ALWAYS,
          email: PaymentSheet.CollectionMode.ALWAYS,
        },
      });
      if (!error) return true;
      return false;
    } else {
      ToastAndroid.show(res.data.error, ToastAndroid.LONG);
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

  useEffect(() => {
    getCurrencies().then((currencies) => {
      const userCurrency = currencies.find(
        (_currency) =>
          _currency.code.toLowerCase() ===
          getLocales()[0].currencyCode?.toLocaleLowerCase()
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
          }}
        >
          <Card style={{ width: "80%" }}>
            <Card.Cover
              source={require("~/assets/images/notification.png")}
              resizeMode="center"
              resizeMethod="scale"
              style={{ height: 125, backgroundColor: colors.primary }}
            />
            <Card.Content style={{ marginTop: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
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
                left={
                  <TextInput.Affix
                    text={currency?.symbol}
                    textStyle={{ paddingRight: 3 }}
                  />
                }
                label={t("amount")}
                keyboardType="numeric"
                mode="flat"
                value={amount}
                onChangeText={(value) => setAmount(value)}
                style={{ marginVertical: 5 }}
              />
              {amount.length > 0 &&
                (!isValidAmount ? (
                  <Text style={{ color: "red" }}>{t("invalid_amount")}</Text>
                ) : (
                  currency &&
                  parsedAmount < currency.minimum && (
                    <Text style={{ color: "red" }}>
                      {t("minimum_amount", {
                        amount: `${currency.symbol}${currency.minimum}`,
                      })}
                    </Text>
                  )
                ))}
            </Card.Content>
            <Card.Actions style={{ justifyContent: "flex-end" }}>
              <Button onPress={hideDonatePopup}>{t("no")}</Button>
              <Button
                onPress={openPaymentSheet}
                disabled={
                  !currency ||
                  !isValidAmount ||
                  amount.length === 0 ||
                  parsedAmount < currency.minimum
                }
              >
                {t("donate")}
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </Modal>
    </Portal>
  );
}
