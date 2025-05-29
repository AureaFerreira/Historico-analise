import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, } from "react-native";

export default function CardProximaSessao({ bgColor, sessaoProxima, nome }) {
    

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };
    if (!sessaoProxima ) {
        return (
            <View style={[styles.cardSessão, { backgroundColor: bgColor }]}>
                <Text style={styles.textoCardSessao}>Nenhuma sessão agendada</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <View style={{ marginBottom: 3 }}>
                <Text style={{ fontFamily: 'Poppins-Medium', color: 'white', fontSize: 18 }}>Próxima sessão</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 3, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                        <Ionicons name="person-outline"
                            size={20}
                            color={bgColor}
                            style={{ backgroundColor: 'white', borderRadius: 5, padding: 1, }} />
                        <Text style={styles.textoCardSessao} numberOfLines={1}>{nome.nome}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                        <Ionicons name="calendar-outline"
                            size={20}
                            color={bgColor}
                            style={{ backgroundColor: 'white', borderRadius: 5, padding: 1, }} />
                        <Text style={styles.textoCardSessao}>{formatDate(sessaoProxima.sessaoProxima.data)}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="alarm-outline"
                            size={20}
                            color={bgColor}
                            style={{ backgroundColor: 'white', borderRadius: 5, padding: 1, }} />
                        <Text style={styles.textoCardSessao}>{sessaoProxima.sessaoProxima.hora_inicio.substring(0, 5)}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end'}}>
                    <Ionicons name="chevron-forward-outline"
                        size={20}
                        color={'white'} />
                </View>
            </View>

        </View>
    )
};
const styles = StyleSheet.create({
    container: {
        padding: 8,
        display: 'flex',

    },
    textoCardSessao: {
        fontFamily: 'Poppins-Light',
        color: 'white',
        fontSize: 16,
        marginLeft: 6
    }
});
