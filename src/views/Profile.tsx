import { View } from "react-native";
import { Avatar, List, Text } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import CurrencyIcon from "../components/CurrencyIcon";
import { sBalance, sProgress, sUsername } from "../utils/ValorantAPI";

export default function Profile() {
  return (
    <View style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 15,
        }}
      >
        <Avatar.Text size={48} label={sUsername.slice(0, 2).toUpperCase()} />
        <Text style={{ marginLeft: 10, fontSize: 30, fontWeight: "bold" }}>
          {sUsername}
        </Text>
      </View>
      <List.Section>
        <List.Subheader>Progress</List.Subheader>
        <List.Item
          title="Level"
          description={sProgress.level}
          left={(props) => <List.Icon {...props} icon="chevron-triple-up" />}
        />
        <List.Item
          title="XP"
          description={sProgress.xp}
          left={(props) => <List.Icon {...props} icon="chart-bubble" />}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>Balances</List.Subheader>
        <List.Item
          title="Valorant Points"
          description={sBalance.vp.toString()}
          descriptionNumberOfLines={1}
          left={(props) => <CurrencyIcon icon="vp" paper />}
        />
        <List.Item
          title="Radianite Points"
          description={sBalance.rad.toString()}
          descriptionNumberOfLines={1}
          left={(props) => <CurrencyIcon icon="rad" paper />}
        />
        <List.Item
          title="Free Agents"
          description={sBalance.fag.toString()}
          descriptionNumberOfLines={1}
          left={(props) => <List.Icon {...props} icon="account-supervisor" />}
        />
      </List.Section>
    </View>
  );
}
