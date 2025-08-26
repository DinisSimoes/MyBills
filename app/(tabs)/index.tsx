import { View, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Menu() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button title="Nova Fatura" onPress={() => router.push("/(tabs)/nova-fatura")} />
      <Button title="Consultar Faturas" onPress={() => router.push("/(tabs)/explore")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});