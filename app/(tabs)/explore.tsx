import { View, Text, StyleSheet } from "react-native";

export default function ConsultarFaturas() {
  return (
    <View style={styles.container}>
      <Text>Aqui você poderá consultar suas faturas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});