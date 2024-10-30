import { Banner } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isBatteryOptimizationEnabledAsync } from "expo-battery";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import { useWishlistStore } from "~/hooks/useWishlistStore";
import { AppState, Platform } from "react-native";
import * as Application from "expo-application";

export default function BatteryOptimizationWarning() {
  const [batteryOptimizationEnabled, setBatteryOptimizationEnabled] =
    useState(false);
  const { t } = useTranslation();
  const notificationEnabled = useWishlistStore(
    (state) => state.notificationEnabled
  );

  useEffect(() => {
    if (Platform.OS !== "android") return;

    checkBatteryOptimizations();

    const sub = AppState.addEventListener("focus", () => {
      checkBatteryOptimizations();
    });

    return () => {
      sub.remove();
    };
  }, []);

  const checkBatteryOptimizations = async () => {
    const enabled = await isBatteryOptimizationEnabledAsync();
    setBatteryOptimizationEnabled(enabled);
  };

  const requestIgnoreBatteryOptimizations = async () => {
    await startActivityAsync(
      ActivityAction.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
      { data: `package:${Application.applicationId}` }
    );
    await checkBatteryOptimizations();
  };

  return (
    <Banner
      visible={notificationEnabled && batteryOptimizationEnabled}
      style={{ backgroundColor: "#ffa70025" }}
      actions={[
        {
          label: t("battery_optimization_warning.action"),
          onPress: () => requestIgnoreBatteryOptimizations(),
        },
      ]}
      icon={({ color, size }) => (
        <Icon name="battery-alert" color={color} size={size} />
      )}
    >
      {t("battery_optimization_warning.description")}
    </Banner>
  );
}
