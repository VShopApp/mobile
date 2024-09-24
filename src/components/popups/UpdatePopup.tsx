import axios from "axios";
import React from "react";
import { useTranslation } from "react-i18next";
import { Linking, View } from "react-native";
import {
  Button,
  Card,
  Modal,
  Paragraph,
  Portal,
  Title,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { version } from "../../../package.json";

export default function UpdatePopup() {
  const [visible, setVisible] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    const checkUpdate = async () => {
      const res = await axios.request({
        url: "https://api.github.com/repos/vshopapp/mobile/releases/latest",
        method: "GET",
      });
      if (compareVersions(res.data.tag_name) === -1) setVisible(true);
    };
    checkUpdate();
  }, []);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}>
          <Card style={{ width: "80%" }}>
            <Card.Content>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <Icon
                  name="update"
                  size={25}
                  color="white"
                  style={{ marginRight: 5 }}
                />
                <Title style={{ color: "#fff" }}>
                  {t("update.available.title")}
                </Title>
              </View>
              <Paragraph>{t("update.available.description")}</Paragraph>
            </Card.Content>
            <Card.Actions style={{ justifyContent: "flex-end" }}>
              <Button onPress={() => setVisible(false)}>{t("no")}</Button>
              <Button
                onPress={() =>
                  Linking.openURL(
                    "https://github.com/VShopApp/mobile/releases/latest",
                  )
                }>
                {t("update.download_github")}
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </Modal>
    </Portal>
  );
}

function compareVersions(githubTag: string) {
  const versionParts = version.split(".");
  const githubTagParts = githubTag.replace("v", "").split(".");

  for (let i = 0; i < versionParts.length; i++) {
    const versionNumber = Number.parseInt(versionParts[i]);
    const githubTagNumber = Number.parseInt(githubTagParts[i]);

    if (versionNumber < githubTagNumber) {
      return -1;
    } else if (versionNumber > githubTagNumber) {
      return 1;
    }
  }

  return 0;
}
