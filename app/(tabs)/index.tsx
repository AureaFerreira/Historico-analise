import { useAppContext } from "@/components/provider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Login() {
  const { buscaLogin } = useAppContext();
  const [email, setEmail] = useState('psi');
  const [senha, setSenha] = useState('1234');
  const [carregando, setCarregando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const acessarConta = async () => {
    setCarregando(true);
    const tipoUsuario = await buscaLogin(email, senha);
    if (tipoUsuario === "Paciente") {
      router.replace("/paciente/home");
      setCarregando(false);
    } else if (tipoUsuario === "Psicologo") {
      router.replace("/psicologo/home");
      setCarregando(false);

    } else {
      console.log("Usuário não encontrado ou erro na autenticação.");
      setCarregando(false);

    }

  };
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => Keyboard.dismiss()}>
        <View style={styles.innerContainer}>
          <Image
            source={require("@/assets/images/logoRosa.png")}
            style={styles.logo}
          />
          <View style={styles.card}>
            <Text style={styles.label}>E-mail ou nome de usuário</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#F37187"
                style={styles.icon}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                editable
                placeholderTextColor="#e63946"
              />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#F37187"
                style={styles.icon}
              />
              <TextInput
                value={senha}
                editable

                onChangeText={setSenha}
                style={styles.input}
                placeholderTextColor="#F37187"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#F37187"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={acessarConta}>
              {!carregando ? (
                <Text style={styles.loginText}>Entrar</Text>

              ) : (
                <ActivityIndicator size="small" color="white" />

              )}
            </TouchableOpacity>


            <TouchableOpacity>
              <Text style={styles.registerText}>
                É novo por aqui?{" "}
                <Text style={styles.registerLink}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffebee",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 288.96,
    height: 63.13,
    marginBottom: 20,
    alignSelf: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#DEB7B7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10, // Para funcionar no Android
    alignItems: "center",
  },
  label: {
    color: "#e63946",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 5,
    width: "100%",
    fontFamily: 'Poppins-Light'
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F37187",
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#FFF9F9",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#e63946",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#e63946",
    fontSize: 12,
    marginVertical: 15,
    fontFamily: 'Poppins-Light'

  },
  loginButton: {
  backgroundColor: "#F37187",
  width: 140,        // mais largo
  height: 55,        // altura menor
  borderRadius: 27,  // metade da altura
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 20, // espaçamento em cima e embaixo
},
loginText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
  fontFamily: "Poppins-Bold",
  textAlign: "center",

  },
  orText: {
    color: "#e63946",
    marginVertical: 15,
    fontFamily: 'Poppins-Light'

  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    justifyContent: "center",
    marginBottom: 15,
    fontFamily: 'Poppins-Light'

  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 15,
    fontFamily: 'Poppins-Light'
    ,
    color: "#333",
  },
  registerText: {
    color: "#333",
    fontSize: 13,
    fontFamily: 'Poppins-Light'

  },
  registerLink: {
    color: "#F37187",
    fontWeight: "bold",
  },
});
