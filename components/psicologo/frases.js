import React from "react";
import { Card } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Ionicons } from "@expo/vector-icons";

const frases = [
  "Acredite em si mesmo e tudo será possível. 💪✨",
  "Cada dia é uma nova chance para recomeçar. 🌅",
  "O sucesso é a soma de pequenos esforços diários. 🚀",
  "Persista! Grandes conquistas levam tempo. ⏳",
  "Aprenda com o passado, viva o presente, construa o futuro. 📖",
  "Seja a mudança que você quer ver no mundo. 🌍",
  "Nunca desista dos seus sonhos! 🌟",
];

const FraseMotivacional = () => {
  const hoje = new Date();
  const indiceFrase = hoje.getDate() % frases.length;
  const fraseDoDia = frases[indiceFrase];

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {/* <Ionicons name="chatbubble-ellipses-outline" size={28} color="#F37187" /> */}
        <Text style={styles.frase}>{fraseDoDia}</Text>
        <Text style={styles.data}>
          {format(hoje, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
    margin: 5,
    elevation: 3, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  cardContent: {
    alignItems: "center",
  },
  frase: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#F37187",
    fontFamily:'Poppins-Light'
  },
  data: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
    fontFamily:'Poppins-Light'
  },
});

export default FraseMotivacional;
